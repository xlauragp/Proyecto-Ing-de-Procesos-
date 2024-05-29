// ISA: InnovaWer Artificial Intelligence Website/Webpage Asistant
if(!$) $=jQuery;

var adat='';
var lque='';
var lans='';
var ncht=0;
var chat=[];
function ISA(xprompt){
    //aia(mprompt+xprompt); 
    chat[ncht]={};
    chat[ncht].que=xprompt;
    //console.log(chat);
    // get last N chat entries
    var c=ncht-10;
    if(c<0) c=0;
    //console.log(c+' -> '+ncht);
    xprompt='';
    for(var i=c; i<ncht+1; i++){
        xprompt+=String.fromCharCode(10)+String.fromCharCode(10);
        xprompt+='Q: '+chat[i].que;
        if(chat[i].ans){
            xprompt+=String.fromCharCode(10);
            xprompt+='A: '+chat[i].ans;
        }
    }
    //mprompt+='Q: '+xprompt+'\nA: ';
    
    var l=2049-mprompt.length/3; //tokens
    console.log(l+' tokens max');
    if(l<0){
        // can question any more!!! do somthing
        l=64;
    }
    if(l>128) l=128;
    var prompt=mprompt+xprompt;
    console.log(l+' tokens requested\n\n'+prompt);
    getAnsIWAI(prompt, function(ret){
        const d = new Date();
        console.log('-- AI Response on '+d.toString()+' --');
        if(ret){
            console.log(ret);
            //if(typeof ret == 'object') ret=ret.res;
            /*ret=Json2Obj(ret);
            ret=ret.choices[0].text;
            console.log(ret);*/
            //ret=ret.replace(/A:/g,'').trim();
            adat='';
            var r=ret.lastIndexOf(';');
            if(r>=0){
                adat=ret.substring(r+1);
                ret=ret.substring(0, r);
            }
            // log ans in array
            chat[ncht].ans=ret; ncht++;
            //db log prompt and completition
            //mprompt+=ret+'\n\n';
            lans=ret;
            //if(ret.indexOf('http')>=0) goto(ret, inf.follow*1000, true);
            
            /*var lang=$('html').attr('lang');
            if(lang=='auto') lang='en';
            else lang=lang.substring(0,2);
            console.log('lang: '+lang);
    		if(lang!='en'){
    			gtrx(ret, function(res){answer(res);}, lang, 'en', null, inf.sync);
    		}else */
    		answer(ret);
        }else{
            console.log('No answer',ret);
            ret='There was a problem with your device capturing or understading you sentence, please try again.';
            
            /*var lang=$('html').attr('lang');
            if(lang=='auto') lang='en';
            else lang=lang.substring(0,2);
            console.log('lang: '+lang);
    		if(lang!='en'){
    			gtrx(ret, function(res){answer(res);}, lang, 'en', null, inf.sync);
    		}else */
    		answer(ret);
        }
    }, l, inf.temp, inf.model, null, inf.sync);
}

function goto(loc, to, nom){ 
    if(typeof to == 'undefined') to=500;
    var i=loc.indexOf('http');
    if(i>=0){
        var j=idxOf(loc, ')|,| ', i); //ret.indexOf(' ', i);
        if(j<0) j=loc.length;
        var url=loc.substring(i,j).trim();
        if(url.length-j<2) url=url.substring(0, j);
        var href=location.href;
        if(href[href.length-1]=='/'&&url[url.length-1]!='/') url+='/';
        if(url&&url!=href){
            if(to) setTimeout(function(){location=url;}, to);
        }else if(url==href){
            if(!nom) answer('You are in that page!'+xres);   
        }
    }
}

function idxOf(str, mstr, s){
    if(!s) s=0;
    var idx=mstr.split('|');
    var j=-1;
    for(var i=0; i<idx.length; i++){
        j=str.indexOf(idx[i], s);
        if(j>=0) break;
    }
    return j;
}

var sato=null;
function showAns(txt){
    //clearTimeout(sato);
    $('.ISA_msg').remove();
    var i=txt.indexOf('http');
    var que=false;
    if(chat[ncht-1]) que=chat[ncht-1].que;
    if(i>=0){
        var j=idxOf(txt, ')|,| ', i); //txt.indexOf(' ', i);
        if(j<0) j=txt.length;
        var url=txt.substring(i,j).trim();
        j=url.lastIndexOf('.');
        if(url.length-j<2) url=url.substring(0, j);
        txt=txt.replace(url, '<a href="'+url+'">'+url+'</a>');
    }
    $('body').append('<div class="ISA_msg">'+(que?'<small class="que">'+que+'</small>':'')+txt
                    +(talker?'<small class="talker">ISA - '+talker.name+'</small>':'')
                    +(adat?'<small class="adat">'+adat+'</small>':'')+'</div>');
    //sato=setTimeout(function(){$('.ISA_msg').fadeOut("slow",function(){$(this).remove();});}, txt.length*120+3000);
}

var xres='';
function answer(ret){
    clearTimeout(sato);
    if(!ret.trim()) return;
    console.log('ans:'+ret);
    if(!inf.veng) iniAns(); // voice engine
    ret+=xres;
    
    var lang=$('html').attr('lang');
    if(!lang||lang=='auto') lang='en';
    else lang=lang.substring(0,2);
    console.log('lang: '+lang);
    ret=ret.replace('A: ','');
	if(lang!='en'){
		gtrx(ret, function(res){
		    showAns(res);
		    if(inf.veng=='google') gTalk(res, inf.vol, inf.rate, inf.pitch, inf.voice, inf.sex, iniAns, function(){sato=setTimeout(function(){doneAns(ret);}, inf.sync?ret.length*80*inf.rate:1000);}, inf.sync);
		    else talk(ret, inf.vol, inf.rate, inf.pitch, inf.voice);
		}, lang, 'en', null, inf.sync);
	}else{
	    showAns(ret);
	    if(inf.veng=='google') gTalk(ret, inf.vol, inf.rate, inf.pitch, inf.voice, inf.sex, iniAns, function(){sato=setTimeout(function(){doneAns(ret);}, inf.sync?ret.length*80*inf.rate:1000);}, inf.sync);
	    else talk(ret, inf.vol, inf.rate, inf.pitch, inf.voice);
	}

    xres='';
    if(!inf.veng) setTimeout(function(){doneAns(ret);}, ret.length*80*inf.rate);
}
function iniAns(){
    $('#ISA .help').hide();
    $('#ISA .talk').hide();
    $('#ISA .resp').show(); 
}
function doneAns(ret){
    clearTimeout(sato);
    $('#ISA .resp').hide();
    $('#ISA .talk').hide();
    $('#ISA .help').show();
    sato=setTimeout(function(){voiceHelp(); $('.ISA_msg').fadeOut("slow",function(){$(this).remove();});}, 1000);
    if(ret.indexOf('http')>=0) goto(ret, inf.follow*1000, true);
}

var lact='';
var vcto=null;
function voiceHelp(){
    clearTimeout(vcto);
    if(talking()){
        clearTimeout(vcto);
        vcto=setTimeout(function(){voiceHelp();}, 500);
        return;
    }else if(capturingSpeach()){
        captureSpeachStop();
        clearTimeout(vcto);
        $('#ISA .talk').hide();
        $('#ISA .resp').hide();
        $('#ISA .help').show();
        return;
    }
    
    $('#ISA .resp').hide();
    $('#ISA .help').hide();
    $('#ISA .talk').show();
    console.log("captureSpeach");
    
    vcto=setTimeout(function(){
        captureSpeachStop();
        $('#ISA .talk').hide();
        $('#ISA .resp').hide();
        $('#ISA .help').show();
    }, 12000);
    
    var que=$('input.talk').val();
    if(que){
        preProcessReq(que);
        return;
    }
    
    captureSpeach(function(txt, cfd){
        clearTimeout(vcto);
        console.log('cap:'+txt, cfd);
        $('input.talk').val(txt);
        $('#ISA .talk').hide();
        $('#ISA .resp').hide();
        $('#ISA .help').show();
        if(txt){
            var lang=$('html').attr('lang');
            if(!lang||lang=='auto') lang='en';
            else lang=lang.substring(0,2);
            console.log('lang: '+lang);
    		if(lang!='en'){
    			gtrx(txt, function(ret){preProcessReq(ret);}, 'en', lang, null, inf.sync);
    		}else preProcessReq(txt);
        }
    });
}

function preProcessReq(txt){
    console.log(txt);
    $('input.talk').val('');
    txt=txt.toLowerCase();
    if(txt=='more'||txt=='again') txt=lact;
    var stop=false;
    if(txt.indexOf('who')>=0&&(txt.indexOf('developer')>=0||txt.indexOf('creator')>=0)){answer('Cyborg (Enrique) at Innovawer in 2022'); stop=true;}
    else if(txt.indexOf('who')>=0&&(txt.indexOf('developed')>=0||txt.indexOf('created')>=0)){answer('Cyborg (Enrique) at Innovawer in 2022'); stop=true;}
    if(!stop&&inf.cmd) stop=inf.cmd(txt);
    if(!stop){
        var rep=findTxtInArray(chat, 'que', txt);
        if(rep.length&&lque!=txt&&lans==rep[0].ans){
            console.log(rep);
            answer(rep[0].ans);
        }else if(txt.indexOf('scroll')>=0){
            console.log('scrolling');
            var h=0;
            if(txt.indexOf('down')>=0){
                console.log('down');
                h=$(window).scrollTop();
                h+=$(window).height();
                console.log(h);
                $(window).scrollTop(h);
                //$(window).animate({scrollTop : h},'slow', function(){
                   // do after done
                //});
                lact=txt;
                setTimeout(function(){voiceHelp();}, 250);
            }else if(txt.indexOf('up')>=0){
                console.log('up');
                h=$(window).scrollTop()-$(window).height();
                $(window).scrollTop(h);
                //$(window).animate({scrollTop : h},'slow', function(){
                   // do after done
                //});
                lact=txt;
                setTimeout(function(){voiceHelp();}, 250);
            }else lact='';
        }else if(txt) ISA(txt);
    }
}
/* not working
function chkno(txt,cks,action, doa){
    var ret=false;
    if(cks.test(txt)){
        if(!doa||doa=='go'){
            ret=true;
            goto(action);
        }
    }
    return ret;
}
*/

function getPrompt(){
    return mprompt;
}
function setPrompt(prompt){
    mprompt=prompt;
}
function addPrompt(prompt){
    mprompt+=prompt;
}

var hi=false;
var inito=getCookie('inito');
var mprompt='';
var inf=null;
function setupISA(infp){
    /*
    inf={
        oid: <Organization Identifier>, // Load org settings keys, etc. also pull db logs to minimize OAI calls and prompts
        agreet: <0 no auto togreed, else greet in N secs, >
        setup: <Extra setup function>,
        cmd: <Extra commands function>,
        link_dad: <Links dad selector>,
        prompt: <Additional AI Prompt Text>,
        intro: <introduction text>,
        hi: <hello text>
        style: <#ISA style>,
        img_help: <help image url>,
        img_talk: <talk image url>,
        img_resp: <resp image url>,
        follow: <secs to wait before followinf the url in the response. 0 not follow>
        model: <model name>,
        temp: <model temperature>,
        veng: <voice engine to use>
        voice: <voice name or num>,
        vol: <voice volume 0 - 1>,
        pitch: <voice pitch 0 to 2>,
        rate: <voice 0.1 to 10>,
        sync: bool sync | async
    }
    */
    if(typeof infp == 'object') inf=infp;
    else if(typeof infp == 'string') inf={prompt:infp};
    else inf={};
    
    if(!inf.oid) inf.oid=false;
    if(!inf.follow) inf.follow=3;
    if(!inf.model) inf.model='smart';
    if(!inf.temp) inf.temp=null;
    if(!inf.veng) inf.veng=null;
    if(!inf.voice) inf.voice=null;
    if(!inf.vol) inf.vol=null;
    if(!inf.pitch) inf.pitch=null;
    if(!inf.rate) inf.rate=1;
    if(!inf.sync) inf.sync=false;
    
    if(!inf.hi) inf.hi='Hi, I am ISA. How can I help?';
    if(!inf.into) inf.intro='Heloo, I am ISA the Artifical Intelligence Assistant for this web site. How can I help?';
    
    if(!inf.img_help) inf.img_help='https://innovawer.com/img/help.jpg';
    if(!inf.img_talk) inf.img_talk='https://innovawer.com/img/talk.gif';
    if(!inf.img_resp) inf.img_resp='https://innovawer.com/img/sound-wave0.gif';
    
    mprompt=document.body.innerText;
    mprompt=mprompt.replace(/\x0A/g, ', ');
    mprompt=inf.prompt+'Answer using part of this information: '+mprompt+String.fromCharCode(10);//'\n';
    
    if(!inf.link_dad) inf.link_dad='body';
    var exti='';
    var l=mprompt.length/3;
    $(inf.link_dad+' [href]').each(function(){
        var url=$(this).attr('href');
        var txt=$(this).text();
        var tit=$(this).attr('title');
        if(txt&&tit) txt+=' - ';
        if(tit) txt+=tit;
        if(txt&&l+exti.length/3<1024){
            if(url[0]=='#') return;
            if(url.length<2) return;
            exti+=', '+txt.trim()+': '+url;
        }
    });
    if(exti) exti=exti.substring(2);
    if(exti) mprompt+='Pages, Links, URLs List: '+exti; //+String.fromCharCode(10)+String.fromCharCode(10);//'\n\n';
    
    if(inf.setup) setTimeout(function(){inf.setup();}, 1000);
    
    if(!inf.style){
        inf.style='#ISA{position: fixed; /*top: calc(100% - 60px);*/ bottom: 10px; right: 10px; width: 50px; height: 50px; z-index: 100000000; background-color: #000; border-radius: 10px;} ';
        inf.style+='#ISA>div{display: inline-block; vertical-align: middle; width: 100%; height: 100%; overflow: hidden; border-radius: 10px;} #ISA .help{cursor: pointer;} ';
        inf.style+='.ISA_msg{position: fixed; /*top: calc(100% - 130px);*/ bottom: 70px; right: 10px; width: 400px; max-width: calc(100% - 20px); z-index: 100000000; color: #333; background-color: #fffdc6; padding: 10px; overflow: hidden; border-radius: 20px 20px 1px; box-shadow: 5px 5px 30px;}';
        inf.style+='#ISA>input.talk{position: absolute; top: 5px; left: -210px; width: 200px; max-width: initial;} .ISA_msg small.que{display: block; color: #04F;} .ISA_msg small.talker{display: block; color: #777; float: right;} .ISA_msg small.adat{display: block; font-size: 8px;}';
    }
    
    $('body').append('<style>'+inf.style+'</style>');
    $('body').append('<div id="ISA"><input style="display: none;" class="talk" placeholder="Your question here"/><div class="help"><img src="'+inf.img_help+'"/></div><div style="display: none;" class="talk"><img src="'+inf.img_talk+'"/></div><div class="resp" style="display: none;"><img src="'+inf.img_resp+'"/></div></div>');
    
    
    console.log("ISA ready!");
    var greeting='Hello';
    if($('#greet').length){
        greeting=$('#greet').text();
        var sg=$('#greet').attr('time');
        if(isNaN(sg)){
            sg=5000;    
        }
        if(sg) inf.agreet=sg;
    }
    if(inf.agreet) setTimeout(function(){ISA(greeting);}, inf.agreet);
    $('#ISA').click(function(){
        if(!inito){
            inito=1; 
            setCookie('inito', 1);
            /*if(inf.veng=='google'){
                audio = new Audio('/snd/sound-interference.mp3');
                audio.volume=0.1;
                audio.play();
                //audio.onended=function(){answer(inf.intro);};
            }else */
            answer(inf.intro);
        }else{
            if(!hi){
                hi=true;
                /*if(inf.veng=='google'){
                    answer(inf.hi);
                    //var res=gTalk(inf.hi, inf.vol, inf.rate, inf.pitch, inf.voice, inf.sex, null, null, inf.sync);
                }else */
                answer(inf.hi);
            }else voiceHelp();
        }
    });
    $('input.talk').keypress(function(event){
        clearTimeout(vcto);
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode!='13') return;
        var que=$(this).val();
        if(que){
            preProcessReq(que);
            return;
        }
    });
}

var ais = document.createElement('script');
ais.src = 'https://innovawer.com//eng/ai/js/iwai.js';
document.head.appendChild(ais);
//ais.onload = function () {};
var ais = document.createElement('script');
ais.src = 'https://innovawer.com//lib/js/multimedia.js';
document.head.appendChild(ais);
//ais.onload = function () {};

