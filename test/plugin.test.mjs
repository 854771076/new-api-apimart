import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as plugin from '../plugin.js';

const fixture = JSON.parse(readFileSync(new URL('./contract-fixture.json', import.meta.url), 'utf8'));
for (const entry of fixture.cases) {
  test(entry.name, () => {
    let hook = plugin[entry.hook];
    for (const member of entry.path || []) hook = hook[member];
    if (entry.expectedError) {
      assert.throws(() => hook(...entry.args), error => error.message.includes(entry.expectedError));
    } else {
      // The host also normalizes results through its JSON codec.
      assert.deepEqual(JSON.parse(JSON.stringify(hook(...entry.args))), entry.expected);
    }
  });
}

const inventory = JSON.parse(readFileSync(new URL('../models.json', import.meta.url), 'utf8'));
const images = plugin.meta.protocols.find(p => p.name === 'openai_image').models;

function decode(model, value = {}, kind) {
  const ctx = {model, body:{kind:'json',value}};
  return kind === 'audio' ? plugin.native.decodeAudio(ctx) : kind === 'text' ? plugin.native.decodeVideo(ctx) : plugin.protocols[images.includes(model) ? 'openai_image' : 'openai_video'].decodeRequest(ctx);
}
function driver(intent, extra = {}) {
  return {...intent,upstreamModel:intent.model,baseUrl:'https://api.apimart.ai',apiKey:'fixture-only',...extra};
}

test('every published catalogue model has a task or existing OpenAI channel route', () => {
  const standard = Object.values(inventory.openaiChannel.endpoints).flat();
  assert.equal(new Set(standard).size, 133);
  for (const model of inventory.documentedOnly.models) assert.ok(standard.includes(model), model);
  assert.deepEqual(inventory.openaiChannel.endpoints['/v1/audio/speech'], ['gpt-4o-mini-tts']);
  assert.equal(new Set(plugin.meta.models.map(m => m.toLowerCase())).size, plugin.meta.models.length);
  assert.equal(plugin.meta.models.length,173);
  for (const [kind, models] of Object.entries(inventory.catalog)) {
    for (const model of models) {
      if (standard.includes(model)) continue;
      assert.ok(plugin.meta.models.includes(model),model);
      const schema = plugin.meta.usageProfiles.find(profile => profile.models.includes(model))?.schema;
      assert.ok(schema,model);
      const intent = decode(model, model === 'flowmusic' ? {sound_prompt:'A piano melody'} : model === 'MiniMax-H3-Regeneration' ? {source_task_id:'public_task'} : {prompt:'A red circle'},kind);
      const ctx = driver(intent,{originTasks:[{taskId:'public_task',upstreamTaskId:'private_task',status:'SUCCESS'}]});
      const request = plugin.buildSubmitRequest(ctx);
      assert.equal(request.method,'POST',model);
      assert.equal(request.body.model,model);
      const usage = plugin.extractUsage(ctx);
      for (const [key,value] of Object.entries(usage)) {
        assert.ok(schema[key],`${model}: ${key}`);
        if (typeof value === 'number') assert.ok(Number.isFinite(value) && value >= 0 && value <= 2147483647,model);
      }
      if (kind === 'audio') assert.equal(request.url,'https://api.apimart.ai/v1/music/generations');
      if (model === 'midjourney') assert.equal(request.url,'https://api.apimart.ai/v1/midjourney/generations');
    }
  }
});

test('presets retain identity and pin upstream quality and resolution', () => {
  for (const model of images.filter(m => /-[12]k-/.test(m))) {
    const preset = /^(.*)-([12]k)-(\w+)$/.exec(model);
    const request = plugin.buildSubmitRequest(driver(decode(model,{prompt:'Circle'})));
    assert.equal(request.body.model,preset[1] === 'gpt-image-2' ? 'gpt-image-2-official' : preset[1]);
    assert.equal(request.body.resolution,preset[2]);
    assert.equal(request.body.quality,preset[3]);
  }
});

test('new native parameters survive without losing explicit zero or false', () => {
  for (const [model,params] of [
    ['flux-2-pro',{width:1024,height:1024,seed:0,prompt_upsampling:false}],
    ['wan2.7',{video_urls:['https://fixture.example/input.mp4'],duration:-1,watermark:false}],
    ['seedream-5-5',{sequential_image_generation_options:{max_images:8},layer_decomposition:true}],
    ['kling-v4-long-image',{skill:'ecommerce',length:'long',resolution:'2K'}],
    ['gpt-image-2.6-flare',{complexity:'low',safety_identifier:'test',nsfw_check:false}],
    ['seedance-2.5',{video_urls:['https://fixture.example/input.mp4'],duration:-1,omni_reference_task_type:'edit',generate_audio:false,seed:0,nsfw_check:true}],
  ]) {
    const request = plugin.buildSubmitRequest(driver(decode(model,{prompt:'Circle',...params})));
    for (const [key,value] of Object.entries(params)) assert.deepEqual(request.body[key],value,`${model}: ${key}`);
  }
  const audio = plugin.buildSubmitRequest(driver(decode('suno',{prompt:'Piano',style_weight:0,weirdness_constraint:0,audio_weight:0,instrumental:false},'audio')));
  assert.equal(audio.body.style_weight,0);
  assert.equal(audio.body.instrumental,false);
});

test('catalogue rejects quota bypass, private assets and manufactured file references', () => {
  for (const value of [
    {n:0},{n:101},{duration:1e300},{duration:'999999'},{sample_count:-1},
    {sequential_image_generation_options:{max_images:1000}},
    {parameters:{duration:10000}},{parameters:{source_task_id:'private'}},{max_output_tokens:1e300},
    {parameters:{duration:'10000'}},{parameters:{seconds:null}},{layer_decomposition:'true'},{future_task_id:'private'},
    {parameters:{webhook:'https://fixture.example/callback'}},
    {image_urls:['asset://other-user']},{image_urls:[{__fileRef:'request_file:image'}]},
    {custom_model_id:'private'},{persona_id:'private'},{image_urls:Array(31).fill('https://fixture.example/image.png')},{output_format:'svg',svg:{model:'unknown'}},
    JSON.parse('{"parameters":{"__proto__":{"n":1000}}}'),
  ]) assert.throws(() => decode('flux-2-pro',{prompt:'Circle',...value}));
  assert.throws(() => decode('seedance-2.5',{prompt:'Circle',duration:31}));
  assert.throws(() => decode('gpt-image-2.6-flare',{prompt:'Circle',markup_url:{__fileRef:'request_file:other'}}));
  assert.throws(() => decode('suno',{prompt:'Music',style_weight:-0.1},'audio'));
});

test('credit settlement waits for accounting and rejects invalid charges', () => {
  const ctx = {model:'seedance-2.5'};
  const data = {status:'completed',result:{videos:[{url:'https://fixture.example/video.mp4'}]}};
  assert.deepEqual(plugin.parseTaskResult(ctx,{code:200,data}),{status:'IN_PROGRESS',progress:'99%'});
  assert.deepEqual(plugin.parseTaskResult(ctx,{code:200,data:{...data,cost:null,credits_cost:null}}),{status:'IN_PROGRESS',progress:'99%'});
  assert.deepEqual(plugin.parseTaskResult({model:'kling-v4-long-image'},{code:200,data:{status:'completed',billing_status:'held',cost:1,result:{images:[{url:'https://fixture.example/long.png'}]}}}),{status:'IN_PROGRESS',progress:'99%'});
  for (const bill of [{cost:0.12},{credits_cost:1.2},{cost:0.12,credits_cost:1.2}]) {
    const body = {code:200,data:{...data,...bill}};
    assert.equal(plugin.parseTaskResult(ctx,body).status,'SUCCESS');
    assert.deepEqual(plugin.extractUsageOnComplete(ctx,{status:'SUCCESS'},body),{credits:1.2});
  }
  assert.deepEqual(plugin.extractUsageOnComplete(ctx,{status:'SUCCESS'},{code:200,data:{...data,cost:0}}),{credits:0});
  for (const bill of [{cost:-1},{credits_cost:'1'},{credits_cost:Infinity},{cost:1,credits_cost:1},{credits_cost:2147483648}]) {
    assert.throws(() => plugin.parseTaskResult(ctx,{code:200,data:{...data,...bill}}));
  }
});

test('owned task references are declared and translated only after host resolution', () => {
  for (const [model,params] of [
    ['MiniMax-H3-Regeneration',{source_task_id:'public_task'}],
    ['pixverse-v6',{prompt:'Continue',extend_from_task_id:'public_task'}],
    ['seedance-2.5',{draft_task_id:'public_task',resolution:'4k'}],
    ['flux-3-video',{draft_from_task_id:'public_task',resolution:'fhd'}],
  ]) {
    const intent = decode(model,params);
    assert.deepEqual(intent.originTaskIds,['public_task']);
    assert.throws(() => plugin.buildSubmitRequest(driver(intent)),/owned gateway task/);
    const origins = [{taskId:'public_task',upstreamTaskId:'upstream_task',status:'SUCCESS'}];
    const request = plugin.buildSubmitRequest(driver(intent,{originTasks:origins}));
    const key = Object.keys(params).find(k => k.endsWith('_task_id'));
    assert.equal(request.body[key],'upstream_task');
    assert.equal(intent.requestBody[key],'public_task');
    assert.throws(() => plugin.buildSubmitRequest(driver(intent,{originTasks:[{...origins[0],status:'IN_PROGRESS'}]})),/owned gateway task/);
  }
  assert.throws(() => decode('flux-3-video',{parameters:{draft_from_task_id:'private_task'}}),/top-level gateway task/);
});

test('Seedream layer reservations include the provider default output limit', () => {
  const source = {image_urls:['https://fixture.example/input.png'],layer_decomposition:true};
  const implicit = decode('seedream-5-5',source);
  const explicit = decode('seedream-5-5',{...source,layer_decomposition_options:{max_images:30}});
  assert.equal(implicit.requestBody.layer_decomposition_options.max_images,30);
  assert.deepEqual(plugin.extractUsage(driver(implicit)),plugin.extractUsage(driver(explicit)));
  assert.ok(Math.abs(plugin.extractUsage(driver(implicit)).credits - 31 * 0.035 * 10) < 1e-9);
  assert.equal(source.layer_decomposition_options,undefined);
  for (const max_images of [0,101,'30']) assert.throws(() => decode('seedream-5-5',{...source,layer_decomposition_options:{max_images}}));
  for (const model of ['seedream-5-0-pro','seedream-5-0-flash']) {
    assert.ok(Math.abs(plugin.extractUsage(driver(decode(model,source))).credits - 18 * 0.09 * 10) < 1e-9);
  }
});

test('all forwarded batch count fields affect reservation despite the default image n', () => {
  const base = plugin.extractUsage(driver(decode('flux-2-pro',{prompt:'Circle'}))).credits;
  for (const key of ['sample_count','num_images','batch_size','num_outputs','layers','max_layers']) {
    const intent = decode('flux-2-pro',{prompt:'Circle',[key]:4});
    assert.equal(plugin.extractUsage(driver(intent)).credits,base*4,key);
  }
});

test('accepted asynchronous submissions preserve their task for polling', () => {
  for (const model of ['gpt-image-2.5-ext','grok-imagine-2.0-ext','muse-image-ext','muse-video-ext']) {
    const intent = decode(model,{prompt:'Circle'});
    const response = {status:202,body:{code:202,data:{id:'accepted_task',object:'generation.task',status:'pending'}}};
    assert.equal(plugin.parseSubmitResponse(driver(intent),response).taskId,'accepted_task');
    assert.throws(() => plugin.parseSubmitResponse(driver(intent),{...response,body:{...response.body,code:400}}),/submission failed/);
  }
});

test('Seedance maps standard video pixel sizes and rejects conflicting parameters', () => {
  for (const [size,ratio,resolution] of [['1280x720','16:9','720p'],['1080x1920','9:16','1080p'],['3840x2160','16:9','4k']]) {
    const intent = decode('seedance-2.5',{prompt:'A cat',size});
    const request = plugin.buildSubmitRequest(driver(intent));
    assert.equal(request.body.size,ratio);
    assert.equal(request.body.resolution,resolution);
  }
  assert.equal(decode('seedance-2.5',{prompt:'Cat',size:'adaptive'}).requestBody.size,'adaptive');
  assert.throws(() => decode('seedance-2.5',{prompt:'Cat',size:'1280x720',resolution:'1080p'}),/size and resolution/);
  assert.throws(() => decode('seedance-2.5',{prompt:'Cat',size:'1280x720',aspect_ratio:'9:16'}),/size and aspect_ratio/);
  assert.throws(() => decode('seedance-2.0-fast',{prompt:'Cat',size:'1920x1080'}),/resolution/);
});

test('music and prompt results are presented and downloaded correctly', () => {
  const intent = plugin.protocols.openai_responses.decodeRequest({model:'flowmusic',body:{kind:'json',value:{input:'A piano melody'}}});
  assert.equal(plugin.buildSubmitRequest(driver(intent)).body.sound_prompt,'A piano melody');
  const music = {code:200,data:{status:'completed',cost:0.06,result:{music:[{audio_url:'https://fixture.example/one.mp3'},{wav_url:'https://fixture.example/two.wav'}]}}};
  assert.equal(plugin.parseTaskResult({model:'flowmusic'},music).status,'SUCCESS');
  const task = {status:'SUCCESS',data:music};
  assert.deepEqual(plugin.listArtifacts(task),[{key:'audio_0',type:'audio'},{key:'audio_1',type:'audio'}]);
  assert.deepEqual(plugin.buildContentRequest({data:music,artifactKey:'audio_1',clientRequest:{method:'GET'}}),{url:'https://fixture.example/two.wav',method:'GET',credentialless:true});
  const rendered = plugin.protocols.openai_responses.renderFinal({artifacts:{audio_0:{url:'https://gateway.example/one'},audio_1:{url:'https://gateway.example/two'}}},task);
  assert.match(rendered.output[0].content[0].text,/<audio controls/);
  const prompt = {code:200,data:{status:'completed',cost:0.01,result:{prompt:'Enhanced cinematic prompt'}}};
  assert.equal(plugin.parseTaskResult({model:'MiniMax-H3-Context-IR'},prompt).status,'SUCCESS');
  assert.equal(plugin.protocols.openai_responses.renderFinal({}, {status:'SUCCESS',data:prompt}).output[0].content[0].text,'Enhanced cinematic prompt');
});

test('reference-image pricing cannot silently inherit an unknown pixel size', () => {
  assert.equal(decode('gpt-image-2',{prompt:'Edit',image_urls:['https://fixture.example/input.png']}).requestBody.size,'auto');
  const request = decode('seedance-2.5',{prompt:'Animate',first_frame_image:'https://fixture.example/first.png',last_frame_image:'https://fixture.example/last.png'}).requestBody;
  assert.deepEqual(request.image_with_roles.map(x=>x.role),['first_frame','last_frame']);
});

test('Responses background mode stays separate from image background parameters', () => {
  for (const model of ['gpt-image-2.6-flare','flux-2-pro']) {
    const ctx = {model,body:{kind:'json',value:{model,input:'Circle',background:true,metadata:{background:'transparent'}}}};
    const intent = plugin.protocols.openai_responses.decodeRequest(ctx);
    assert.equal(intent.requestBody.background,'transparent');
    delete ctx.body.value.metadata;
    assert.equal(plugin.protocols.openai_responses.decodeRequest(ctx).requestBody.background,undefined);
  }
});

test('GPT Image 2.6 GIF frames fit the documented sheet limits', () => {
  const intent = decode('gpt-image-2.6-flare',{prompt:'A bouncing ball',output_format:'gif',frame_count:9,size:'512x512',frame_duration_ms:100});
  const request = plugin.buildSubmitRequest(driver(intent));
  assert.equal(request.body.output_format,'gif');
  assert.equal(request.body.frame_count,9);
  assert.throws(() => decode('gpt-image-2.6-flare',{prompt:'Ball',output_format:'gif',frame_count:16,size:'2048x2048'}),/sheet exceeds/);
  assert.throws(() => decode('gpt-image-2.6-ext',{prompt:'Ball',output_format:'gif',frame_count:9}),/frame controls/);
});

test('Wan video edit preserves provider metadata through every normalization', () => {
  const intent = decode('wan2.7-videoedit',{prompt:'Keep the voice',video_urls:['https://fixture.example/source.mp4'],metadata:{audio_setting:'origin'}});
  const request = plugin.buildSubmitRequest(driver(intent));
  assert.deepEqual(request.body.metadata,{audio_setting:'origin'});
  assert.equal(request.body.audio_setting,undefined);
  assert.ok(plugin.extractUsage(driver(intent)).credits > 0);
  assert.throws(() => decode('wan2.7-videoedit',{prompt:'Edit',metadata:{audio_setting:'invalid'}}),/audio_setting/);
});

test('legacy image token profiles wait for complete modality accounting', () => {
  const ctx = {model:'gpt-image-2.5-flare',state:{hasInputImages:true}};
  const data = {status:'completed',result:{images:[{url:'https://fixture.example/image.png'}]},usage:{input_tokens:100,output_tokens:200}};
  assert.deepEqual(plugin.parseTaskResult(ctx,{code:200,data}),{status:'IN_PROGRESS',progress:'99%'});
  assert.throws(() => plugin.extractUsageOnComplete(ctx,{status:'SUCCESS'},{code:200,data}),/settlement tokens are unavailable/);
  data.usage.input_tokens_details = {image_tokens:80,cached_tokens:50};
  assert.equal(plugin.parseTaskResult(ctx,{code:200,data}).status,'IN_PROGRESS');
  data.usage.input_tokens_details.cached_tokens_details = {image_tokens:40};
  assert.equal(plugin.parseTaskResult(ctx,{code:200,data}).status,'SUCCESS');
  assert.deepEqual(plugin.extractUsageOnComplete(ctx,{status:'SUCCESS'},{code:200,data}),{image_count:1,output_tokens:200,text_tokens:10,image_tokens:40,cached_text_tokens:10,cached_image_tokens:40});
  data.usage.input_tokens_details.cached_tokens = -1;
  assert.equal(plugin.parseTaskResult(ctx,{code:200,data}).status,'IN_PROGRESS');
});


test('documented video defaults avoid the generic maximum reservation', () => {
  for (const [model, duration] of [['flux-3-video',5],['wan3.0-video',5],['viduq3',5],['muse-video-ext',10],['MiniMax-Hailuo-2.3',6]]) {
    const implicit = plugin.extractUsage(driver(decode(model,{prompt:'A cat'})));
    const explicit = plugin.extractUsage(driver(decode(model,{prompt:'A cat',duration})));
    assert.deepEqual(implicit,explicit,model);
  }
  assert.ok(Math.abs(plugin.extractUsage(driver(decode('flux-3-video',{prompt:'A cat'}))).credits - 26.5) < 1e-9);
  const auto = plugin.extractUsage(driver(decode('wan3.0-video',{prompt:'A cat',duration:-1})));
  const maximum = plugin.extractUsage(driver(decode('wan3.0-video',{prompt:'A cat',duration:30})));
  assert.deepEqual(auto,maximum);
  assert.deepEqual(plugin.extractUsage(driver(decode('flux-3-video',{prompt:'Cat',video_urls:[]}))), plugin.extractUsage(driver(decode('flux-3-video',{prompt:'Cat'}))));
});

test('reference-driven video reservations cover ignored output duration', () => {
  for (const [model,params] of [['happyhorse-1.0',{video_url:'https://fixture.example/input.mp4'}],['skyreels-v4-fast',{ref_videos:[{url:'https://fixture.example/input.mp4',type:'reference'}]}]]) {
    const short = plugin.extractUsage(driver(decode(model,{prompt:'Edit',duration:3,...params})));
    const long = plugin.extractUsage(driver(decode(model,{prompt:'Edit',duration:15,...params})));
    assert.deepEqual(short,long);
    assert.ok(short.credits > plugin.extractUsage(driver(decode(model,{prompt:'Cat',duration:15}))).credits);
  }
});

test('Wan video editing preserves the documented zero duration', () => {
  const intent = decode('wan2.7-videoedit',{prompt:'Edit',duration:0,video_urls:['https://fixture.example/input.mp4']});
  assert.equal(plugin.buildSubmitRequest(driver(intent)).body.duration,0);
  assert.ok(plugin.extractUsage(driver(intent)).credits > 0);
  assert.throws(() => decode('wan2.7',{prompt:'Cat',duration:0}));
  for (const duration of [-1,1,11,null,'0']) assert.throws(() => decode('wan2.7-videoedit',{prompt:'Edit',duration}));
});


test('Responses limits artifacts while image and native endpoints retain full output counts', () => {
  const params = {prompt:'Layers',image_urls:['https://fixture.example/input.png'],layer_decomposition:true,layer_decomposition_options:{max_images:100}};
  const ctx = {model:'seedream-5-5',operation:'generate',body:{kind:'json',value:params}};
  assert.equal(plugin.protocols.openai_image.decodeRequest(ctx).requestBody.layer_decomposition_options.max_images,100);
  assert.throws(() => plugin.protocols.openai_responses.decodeRequest({...ctx,body:{kind:'json',value:{...params,input:'Layers'}}}),/at most 64 outputs/);
  const native = plugin.native.decodeImage({model:ctx.model,body:ctx.body});
  assert.equal(plugin.buildSubmitRequest(driver(native)).body.layer_decomposition_options.max_images,100);
  assert.equal(plugin.protocols.openai_responses.decodeRequest({...ctx,body:{kind:'json',value:{...params,input:'Layers',layer_decomposition_options:{max_images:64}}}}).requestBody.layer_decomposition_options.max_images,64);
});
