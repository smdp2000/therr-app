!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var s in r)("object"==typeof exports?exports:e)[s]=r[s]}}(global,function(){return function(e){var t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,function(t){return e[t]}.bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s="dbOV")}({"1hBF":function(e,t,r){global,e.exports=function(e){var t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,function(t){return e[t]}.bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s="Sxyf")}({Sxyf:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=(e=>{if(e.shouldPrintLogs){const t=0!==e.time?`<at:${e.time||new Date}>`:"",r=Array.isArray(e.messages)?e.messages:[e.messages];for(let s=0;s<r.length;s+=1)e.messageOrigin?console.info(`${e.messageOrigin}${t}:`,r[s]):console.info(`LOG${t}:`,r[s])}})}})},"2fUc":function(e,t,r){const{extraSanitizers:s,extraValidators:n}=r("H3H2");t.isSanitizer=(e=>e.startsWith("to")||s.includes(e)),t.isValidator=(e=>e.startsWith("is")||n.includes(e))},"7WL4":function(e,t){e.exports=require("https")},AAMX:function(e,t,r){const{buildCheckFunction:s,check:n,body:o,cookie:i,header:a,param:u,query:c}=r("hGP2");e.exports={buildCheckFunction:s,check:n,body:o,cookie:i,header:a,param:u,query:c,checkSchema:r("wQ9L"),oneOf:r("AfJv"),validationResult:r("QlU4")}},AfJv:function(e,t,r){const s=r("YLtl"),n=r("wine");var o;function i(e){return e._context}e.exports=((e,t)=>(r,o,a)=>{const u=e=>n(r,i(e)),c=s.flatMap(e,e=>Array.isArray(e)?e.map(i):i(e)),l=e.map(e=>{const t=Array.isArray(e)?e:[e];return Promise.all(t.map(u)).then(e=>s.flatten(e))});return Promise.all(l).then(n=>{r._validationContexts=(r._validationContexts||[]).concat(c),r._validationErrors=r._validationErrors||[];const o=(e=e,s(n).flatMap((t,r)=>t.length>0?e[r]:[]).map(i).value());return r._validationOneOfFailures=(r._validationOneOfFailures||[]).concat(o),n.some(e=>0===e.length)||r._validationErrors.push({param:"_error",msg:function(e,t){if("function"!=typeof e)return e;return e({req:t})}(t||"Invalid value(s)",r),nestedErrors:s.flatten(n,!0)}),a(),n}).catch(a)})},AtKU:function(e,t){e.exports={development:{apiPort:7770,baseApiRoute:"http://localhost:7770/api/v1",baseSocketUrl:"http://localhost:7771",googleAnalyticsKey:"",redisHost:"127.0.0.1",redisPubPort:17771,redisSubPort:17772,socketPort:7771,socket:{pingInterval:1e4,pingTimeout:5e3,userSocketSessionExpire:36e5}},production:{apiPort:7770,baseApiRoute:"https://rili.live:7770/api/v1",baseSocketUrl:"https://rili.live:7743",googleAnalyticsKey:"",redisHost:"127.0.0.1",redisPubPort:17771,redisSubPort:17772,socketPort:7743,socket:{pingInterval:1e4,pingTimeout:5e3,userSocketSessionExpire:36e5}}}},BZiz:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("ZEFf"),n=r("EixS"),o=r("1hBF"),i=r("dbOV"),a=r("dHZO"),u=r("c8/6"),c=r("YVfa"),l=r("UJyx"),d=r("jxKE"),f=s.Router(),p=!1;t.default=class{constructor(e){this.router=f,this.checkIfUserExists=(e=>{const{id:t,email:r,userName:s,phoneNumber:n}=e;return this.knex.select("*").from("main.users").where(function(){return t?this.where({id:t}):this}).orWhere({email:r}).orWhere({userName:s}).orWhere({phoneNumber:n}).debug(p).then(e=>!!(e&&e.length>0)&&e[0])}),this.getUser=((e,t="id")=>this.knex.select("*").from("main.users").where({[t]:e}).debug(p).then(e=>{if(e&&e.length>0)return!!e[0];throw 404})),this.knex=e,f.use((e,t,r)=>{o.default({shouldPrintLogs:i.shouldPrintSQLLogs,messageOrigin:`SQL:USER_ROUTES:${e.method}`,messages:[e.baseUrl]}),r()}),f.route("/users").get((t,r)=>{e.select("*").from("main.users").orderBy("id").debug(p).then(e=>{r.status(200).send(n.success(e))}).catch(e=>c.default(e,r))}).post(a.createUserValidation,u.validate,(t,r)=>{this.checkIfUserExists(t.body).then(s=>s?r.status(400).send(n.error({id:d.HttpErrors.USER_EXISTS,message:"Username, e-mail, and phone number must be unique. A user already exists.",statusCode:400})):l.hashPassword(t.body.password).then(s=>{e.queryBuilder().insert({email:t.body.email,firstName:t.body.firstName,lastName:t.body.lastName,password:s,phoneNumber:t.body.phoneNumber,userName:t.body.userName}).into("main.users").returning(["email","id","userName","accessLevels"]).debug(p).then(e=>r.status(201).send(n.success(e[0]))).catch(e=>c.default(e,r))})).catch(e=>c.default(e.toString(),r))}),f.route("/users/:id").get((e,t)=>this.getUser(e.params.id).then(e=>{t.send(n.success(e))}).catch(r=>{404===r?t.status(404).send(n.error({message:`No user found with id, ${e.params.id}.`,statusCode:404})):c.default(r,t)})).put((t,r)=>{e().update({firstName:t.body.firstName,lastName:t.body.lastName,phoneNumber:t.body.phoneNumber,userName:t.body.userName}).into("main.users").where({id:t.params.id}).returning("*").debug(p).then(e=>this.getUser(t.params.id).then(e=>{r.status(200).send(n.success(e))})).catch(e=>c.default(e,r))}).delete((t,r)=>{e.delete().from("main.users").where({id:t.params.id}).then(e=>{e>0?r.status(200).send(n.success(`Customer with id, ${t.params.id}, was successfully deleted`)):r.status(404).send(n.error({message:`No user found with id, ${t.params.id}.`,statusCode:404}))}).catch(e=>c.default(e,r))})}}},CkuN:function(e,t,r){const s=r("YLtl");e.exports=((e,t)=>{t.filter(t=>{return s.get(e[t.location],t.path)!==t.value}).forEach(t=>{""===t.path?s.set(e,t.location,t.value):s.set(e[t.location],t.path,t.value)})})},EixS:function(e,t,r){var s;global,e.exports=(s=r("Os7e"),function(e){var t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,function(t){return e[t]}.bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s="rPjh")}({Os7e:function(e,t){e.exports=s},rPjh:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("Os7e");t.error=(e=>({id:e.id||"notDefined",message:e.message,statusCode:e.statusCode,status:s[e.statusCode]})),t.success=(e=>e)}}))},H3H2:function(e,t){t.extraValidators=["contains","equals","matches"],t.extraSanitizers=["blacklist","escape","unescape","normalizeEmail","ltrim","rtrim","trim","stripLow","whitelist"]},MEnT:function(e,t,r){"use strict";var s;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.USER_EXISTS="userExists"}(s||(s={})),t.default=s},Os7e:function(e,t){e.exports=require("http-status")},QlU4:function(e,t,r){const s=r("YLtl");function n(e={}){return s.defaults(e,{formatter:e=>e}),t=>(function t(r,s=[]){let n=e.formatter;return r.isEmpty=(()=>!s.length),r.array=(({onlyFirstError:e}={})=>{const t={};return(e?s.filter(e=>!t[e.param]&&(t[e.param]=!0,!0)):s).map(n)}),r.mapped=(()=>s.reduce((e,t)=>(e[t.param]||(e[t.param]=n(t)),e),{})),r.formatWith=(e=>(n=e,r)),r.throw=(()=>{if(s.length)throw t(new Error("Validation failed"),s).formatWith(n)}),r})({},t._validationErrors)}e.exports=n(),e.exports.withDefaults=n},QpeL:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("jeq0"),n=r("ZEFf"),o=r("tMJi"),i=r("EixS"),a=r("1hBF"),u=r("dbOV"),c=r("w7Sa"),l=r("c8/6"),d=r("YVfa"),f=r("UJyx"),p=n.Router(),m=!1,h=i.error({message:"Incorrect username or password",statusCode:401});t.default=class{constructor(e){this.router=p,this.getUser=(e=>this.knex.select("*").from("main.users").where({userName:e}).debug(m).then(e=>{if(e&&e.length>0)return e[0];throw 404})),this.knex=e,p.use((e,t,r)=>{a.default({shouldPrintLogs:u.shouldPrintSQLLogs,messageOrigin:`SQL:USER_ROUTES:${e.method}`,messages:[e.baseUrl]}),r()}),p.route("/auth").post(c.authenticateUserValidation,l.validate,(e,t)=>{this.getUser(e.body.userName).then(r=>{s.compare(e.body.password,r.password).then(s=>{if(s){const s=f.createUserToken(r,e.body.rememberMe);return t.status(200).send(i.success(Object.assign({},r,{idToken:s})))}return t.status(401).send(h)}).catch(e=>d.default(e,t))}).catch(e=>404===e?t.status(401).send(h):t.status(500).send("something went wrong"))}),p.route("/auth/logout").post(c.logoutUserValidation,l.validate,(e,t)=>{this.getUser(e.body.userName).then(()=>t.status(204).send()).catch(e=>t.status(500).send("something went wrong"))}),p.route("/auth/user-token/validate").post(c.authenticateUserTokenValidation,l.validate,(e,t)=>{try{const r=o.verify(e.body.idToken,process.env.SECRET);return t.status(200).send(r)}catch(e){return"TokenExpiredError"===e.name?t.status(401).send(e.message):t.status(500).send("something went wrong")}})}}},R9kF:function(e,t,r){const s=r("WZpn"),n=r("wine"),{isSanitizer:o,isValidator:i}=r("2fUc");function a(e){return void 0!==e}function u(e){return null!=e}function c(e){return!!e}e.exports=((e,t,r)=>{let l;const d=[],f=[];e=Array.isArray(e)?e:[e];const p=(e,t,r)=>n(e,p._context).then(t=>{e._validationContexts=(e._validationContexts||[]).concat(p._context),e._validationErrors=(e._validationErrors||[]).concat(t),r()},r);return Object.keys(s).filter(i).forEach(e=>{const t=s[e];p[e]=((...e)=>(d.push({negated:p._context.negateNext,validator:t,options:e}),p._context.negateNext=!1,p))}),Object.keys(s).filter(o).forEach(e=>{const t=s[e];p[e]=((...e)=>(f.push({sanitizer:t,options:e}),p))}),p.optional=((e={})=>(l=e,p)),p.custom=(e=>(d.push({validator:e,custom:!0,negated:p._context.negateNext,options:[]}),p._context.negateNext=!1,p)),p.customSanitizer=(e=>(f.push({sanitizer:e,custom:!0,options:[]}),p)),p.exists=((e={})=>{const t=e.checkFalsy?c:e.checkNull?u:a;return p.custom(t)}),p.isArray=(()=>p.custom(e=>Array.isArray(e))),p.isString=(()=>p.custom(e=>"string"==typeof e)),p.withMessage=(e=>{const t=d[d.length-1];return t&&(t.message=e),p}),p.not=(()=>(p._context.negateNext=!0,p)),p._context={get optional(){return l},negateNext:!1,message:r,fields:e,locations:t,sanitizers:f,validators:d},p})},SWt3:function(e,t){e.exports=require("body-parser")},SfJF:function(e,t){e.exports=require("knex")},UJyx:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("jeq0"),n=r("tMJi");t.hashPassword=(e=>s.hash(e,10)),t.createUserToken=((e,t)=>{const{id:r,userName:s,email:o,phoneNumber:i}=e;return n.sign({id:r,userName:s,email:o,phoneNumber:i},process.env.SECRET,{algorithm:"HS256",expiresIn:t?"30d":"4h"})})},WZpn:function(e,t){e.exports=require("validator")},"Xm2/":function(e,t){e.exports=require("cors")},YLtl:function(e,t){e.exports=require("lodash")},YVfa:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("1hBF"),n=r("EixS"),o=r("dbOV");t.default=((e,t)=>{s.default({shouldPrintLogs:o.shouldPrintSQLLogs,messageOrigin:"SQL:USER_ROUTES:ERROR",messages:[e.toString()]}),t.status(500).send(n.error({message:e.toString(),statusCode:500}))})},ZEFf:function(e,t){e.exports=require("express")},aOOa:function(e,t,r){"use strict";var s;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.transportClose="transport close",e.pingTimeout="ping timeout"}(s||(s={})),t.default=s},ahX3:function(e,t,r){const s=r("WZpn");e.exports=function(e){return Array.isArray(e)&&(e=e.reduce((e,t)=>{return e+(s.isInt(t)?"["+t+"]":e?"."+t:t)},"")),e},e.exports(["foo"])},c7s6:function(e,t){function r(e){return e instanceof Date?e.toISOString():e&&"object"==typeof e&&e.toString?e.toString():null==e||isNaN(e)&&!e.length?"":String(e)}e.exports=(e=>Array.isArray(e)&&e.length?r(e[0]):r(e))},"c8/6":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("AAMX");t.validate=((e,t,r)=>{if(!s.validationResult(e).isEmpty())return t.status(400).json({message:e.errorMessage||"The required parameters were not provided."});r()})},dHZO:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("AAMX");t.createUserValidation=[s.body("phoneNumber").exists().isMobilePhone("any"),s.body("email").exists().isString(),s.body("firstName").exists().isString(),s.body("password").exists().isString().isLength({min:8}),s.body("lastName").exists().isString(),s.body("userName").exists().isString()]},dbOV:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("u/k4"),n=r("SWt3"),o=r("ZEFf"),i=r("Xm2/"),a=r("mw/K"),u=r("7WL4"),c=r("jle/"),l=r("oyvS"),d=r("h5LZ"),f=r("SfJF"),p=r("AtKU"),m=r("1hBF"),h=r("QpeL"),g=r("BZiz");t.shouldPrintAllLogs=d.argv.withAllLogs,t.shouldPrintSQLLogs=d.argv.withSQLLogs||t.shouldPrintAllLogs,t.shouldPrintServerLogs=d.argv.withServerLogs||t.shouldPrintAllLogs;const b=[process.env.CLIENT_URI],v={origin(e,t){-1!==b.indexOf(e)?t(null,!0):t(new Error("Not allowed by CORS"))}},y=`/api/v${r("kiQV").version.split(".")[0]}`,x=o();x.use(n.urlencoded({extended:!0})),x.use(n.json()),x.use(i(v)),x.use(o.static(l.join(__dirname,"static")));const S=f({client:"pg",connection:{user:process.env.PG_USER,host:process.env.PG_HOST,database:process.env.PG_DATABASE,password:process.env.PG_PASSWORD,port:process.env.PG_PORT},pool:{min:2,max:10,log:!0},acquireConnectionTimeout:6e4});if(x.use(y,new h.default(S).router),x.use(y,new g.default(S).router),s.isMaster&&d.argv.shouldCluster){const e=c.cpus().length;m.default({shouldPrintLogs:t.shouldPrintServerLogs,messageOrigin:"API_SERVER",messages:`Master cluster setting up ${e} workers...`});for(let t=0;t<e;t+=1)s.fork();s.on("online",e=>{m.default({shouldPrintLogs:t.shouldPrintServerLogs,messageOrigin:"API_SERVER",messages:`Worker ${e.process.pid} is online`})}),s.on("exit",(e,r,n)=>{m.default({shouldPrintLogs:t.shouldPrintServerLogs,messageOrigin:"API_SERVER",messages:`Worker ${e.process.pid} died with code: ${r}, and signal: ${n}`}),m.default({shouldPrintLogs:t.shouldPrintServerLogs,messageOrigin:"API_SERVER",messages:"Starting a new worker"}),s.fork()})}else{const e={key:a.readFileSync(process.env.DOMAIN_KEY_LOCATION),cert:a.readFileSync(process.env.DOMAIN_CERT_LOCATION)};u.createServer(e,x).listen(p.production.apiPort)}},h5LZ:function(e,t){e.exports=require("yargs")},hGP2:function(e,t,r){const s=r("R9kF"),n=e=>(t,r)=>s(t,e,r);e.exports={buildCheckFunction:n,check:n(["body","cookies","headers","params","query"]),body:n(["body"]),cookie:n(["cookies"]),header:n(["headers"]),param:n(["params"]),query:n(["query"])}},jeq0:function(e,t){e.exports=require("bcrypt")},"jle/":function(e,t){e.exports=require("os")},jxKE:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("aOOa");t.DisconnectReason=s.default;const n=r("MEnT");t.HttpErrors=n.default,t.ACTION="action"},"jyg+":function(e,t,r){const s=r("YLtl"),n=r("ahX3"),o=r("CkuN");var i,a;e.exports=((e,t,r={})=>{let i=[];const a=null==r.filterOptionals||r.filterOptionals?function({optional:e}){const t=[e=>void 0!==e,t=>!e.nullable||null!=t,t=>!e.checkFalsy||t];return r=>!e||t.every(e=>e(r.value))}(t):Boolean,u=function(e,{sanitizers:t=[]},{sanitize:r=!0}){return r?r=>t.reduce((t,n)=>{const o="string"==typeof t.value?(r=t,(s=n).custom?s.sanitizer(r.value,{req:e,location:r.location,path:r.path}):s.sanitizer(r.value,...s.options)):t.value;return Object.assign({},t,{value:o})},r):e=>e;var s,n}(e,t,r);return t.fields.map(e=>null==e?"":e).forEach(r=>{let o=s(t.locations).flatMap((e=e,r=r,t=>{const o="headers"===t?r.toLowerCase():r;return function e(t,r,o){const i=s.toPath(r),a=i.indexOf("*");if(a>-1){const r=a?s.get(t,i.slice(0,a)):t;if(!r)return o;Object.keys(r).map(e=>i.slice(0,a).concat(e).concat(i.slice(a+1))).forEach(r=>e(t,r,o))}else o.push(n(i));return o}(e[t],o,[]).map(r=>({location:t,path:r,value:""===r?e[t]:s.get(e[t],r)})).map(e=>Object.assign(e,{originalValue:e.value}))})).map(u).filter(a).value();if(o.length>1&&t.locations.length>1&&!r.includes("*")){const e=o.filter(e=>void 0!==e.value);o=e.length?e:[o[0]]}i=i.concat(o)}),o(e,i),s.uniqWith(i,s.isEqual)})},kiQV:function(e){e.exports=JSON.parse('{"name":"rili-server","version":"1.0.0","description":"The server side code for Rili","main":"build/index.js","scripts":{"build":"../node_modules/.bin/webpack --env production","build:dev":"../node_modules/.bin/webpack --env development","build:watch":"../node_modules/.bin/webpack --watch --env development","lint:fix":"../node_modules/.bin/eslint --ext .jsx,.js --fix ./ && ../node_modules/.bin/tslint --fix -p ./","lint":"../node_modules/.bin/eslint --ext .jsx,.js ./ && ../node_modules/.bin/tslint -p ./","start":"../node_modules/.bin/pm2 start pm2/ecosystem.config.js --watch --env production","start:api":"../node_modules/.bin/pm2 start pm2/ecosystem.config.js --only rili-server-api --env production","start:api:dev":"npm run build:dev && ../node_modules/.bin/nodemon --require=../node_modules/dotenv/config build/server-api.js dotenv_config_path=../.env --withSQLLogs","start:socket":"../node_modules/.bin/pm2 start pm2/ecosystem.config.js --only rili-server-socket-io --env production","start:socket:dev":"npm run build:dev && ../node_modules/.bin/nodemon --require=../node_modules/dotenv/config build/server-socket-io.js dotenv_config_path=../.env --withAllLogs","test":"npm run lint:fix && echo \\"Error: no test specified\\" && exit 0"},"keywords":["rili","server"],"author":"Rili, Inc.","license":"MIT","dependencies":{},"devDependencies":{}}')},"mw/K":function(e,t){e.exports=require("fs")},oyvS:function(e,t){e.exports=require("path")},tMJi:function(e,t){e.exports=require("jsonwebtoken")},"u/k4":function(e,t){e.exports=require("cluster")},w7Sa:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("AAMX");t.authenticateUserTokenValidation=[s.body("idToken").exists().isString()],t.authenticateUserValidation=[s.body("password").exists().isString().isLength({min:8}),s.body("userName").exists().isString(),s.body("rememberMe").optional().isString()],t.logoutUserValidation=[s.body("userName").exists().isString()]},wQ9L:function(e,t,r){const{isValidator:s}=r("2fUc"),n=r("R9kF"),o=["body","cookies","headers","params","query"],i=["errorMessage","in"];e.exports=((e,t=o,r=n)=>Object.keys(e).map(n=>{const a=e[n],u=r(n,function(e,t){const r=(Array.isArray(e.in)?e.in:[e.in]).filter(Boolean);return(r.length?r:t).filter(e=>o.includes(e))}(a,t),a.errorMessage);return Object.keys(a).filter(e=>a[e]&&!i.includes(e)).forEach(e=>{if("function"!=typeof u[e])return void console.warn(`express-validator: a validator with name ${e} does not exist`);const t=a[e];let r=t.options||[];null==r||Array.isArray(r)||(r=[r]);const n=s(e)||"custom"===e||"exists"===e;n&&t.negated&&u.not(),u[e](...r),n&&u.withMessage(t.errorMessage)}),u}))},wine:function(e,t,r){const s=r("c7s6"),n=r("jyg+");e.exports=((e,t)=>{const r=[],o=n(e,t).map(n=>{const{location:o,path:i,value:a}=n;return t.validators.reduce((u,c)=>u.then(()=>{return function(e){const t=e&&!!e.then;return Promise.resolve(e).then(e=>!(void 0!==e||!t)||e)}(c.custom?c.validator(a,{req:e,location:o,path:i}):c.validator(s(a),...c.options)).then(e=>{if(!c.negated&&!e||c.negated&&e)return Promise.reject()})}).catch(s=>{r.push({location:o,param:i,value:n.originalValue,msg:function(e,t,r){const s=e.find(e=>!!e);if("function"!=typeof s)return s;return s(t.originalValue,{req:r,location:t.location,path:t.path})}([c.message,s&&s.message,s,t.message,"Invalid value"],n,e)})}),Promise.resolve())});return Promise.all(o).then(()=>r)})}})});