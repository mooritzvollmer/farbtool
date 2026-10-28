import {getLuminance,checkContrast} from './scripts.js'

const $=selector=>document.querySelector(selector)
const fields=['foreground','background']
const parseHex=value=>{const raw=value.trim().replace(/^#/,'');if(/^[0-9a-f]{3}$/i.test(raw))return '#'+[...raw].map(c=>c+c).join('');if(/^[0-9a-f]{6}$/i.test(raw))return '#'+raw;return null}
function level(){return $('#dropdownButton').textContent.includes('AAA')?'AAA':'AA'}
function syncPresentation(syncFields=true){
 if(syncFields)for(const id of fields){$('#'+id+'-hex').value=$('#'+id).value.toUpperCase();$('#'+id+'-hex').removeAttribute('aria-invalid');$('#'+id+'-error').textContent=''}
 const a=getLuminance($('#foreground').value),b=getLuminance($('#background').value),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),selected=level(),normal=selected==='AAA'?7:4.5,large=selected==='AAA'?4.5:3,simple=document.body.classList.contains('easy-language')
 const text=ratio>=normal?`${selected}: Kontrast für normale und große Schrift erfüllt.`:ratio>=large?`${selected}: Für große Schrift erfüllt. Für normale Schrift nicht ausreichend.`:`${selected}: Für normale und große Schrift nicht ausreichend.`
 $('#contrast-verdict').textContent=simple?(ratio>=normal?'Der Kontrast reicht für kleine und große Schrift.':ratio>=large?'Für große Schrift reicht der Kontrast. Für kleine Schrift reicht er nicht.':'Der Kontrast reicht nicht für Text. Wähle andere Farben.'):text
 $('#contrast-verdict').dataset.state=ratio>=normal?'passed':ratio>=large?'partial':'failed'
 const position=Math.max(0,Math.min(100,Math.log(ratio)/Math.log(21)*100));$('#scale-pointer').style.left=position+'%'
 $('.contrast-scale').setAttribute('aria-label',`Kontrast ${ratio.toFixed(2)} zu 1. Skala von 1 bis 21, Schwellen bei 3, 4,5 und 7.`)
 document.querySelectorAll('.dropdown-item').forEach(option=>option.setAttribute('aria-selected',String(option.textContent.trim()==='WCAG Level '+selected)))
}
for(const id of fields){
 $('#'+id).addEventListener('input',()=>syncPresentation())
 const hex=$('#'+id+'-hex');hex.addEventListener('input',()=>{const parsed=parseHex(hex.value);if(!parsed){hex.setAttribute('aria-invalid','true');$('#'+id+'-error').textContent='Bitte 3 oder 6 HEX-Zeichen eingeben.';return}hex.removeAttribute('aria-invalid');$('#'+id+'-error').textContent='';$('#'+id).value=parsed;checkContrast();syncPresentation(false)})
 hex.addEventListener('blur',()=>{const parsed=parseHex(hex.value);if(parsed)hex.value=parsed.toUpperCase()})
}
$('#swap-colors').addEventListener('click',()=>{const foreground=$('#foreground').value;$('#foreground').value=$('#background').value;$('#background').value=foreground;checkContrast();syncPresentation()})
const presets={bw:['#000000','#ffffff'],ink:['#292724','#ece7dc'],gray:['#aaaaaa','#ffffff']}
document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{const pair=presets[button.dataset.preset];$('#foreground').value=pair[0];$('#background').value=pair[1];checkContrast();syncPresentation()}))
document.querySelectorAll('.dropdown-item').forEach(option=>option.addEventListener('click',()=>{syncPresentation(false);$('#dropdownButton').focus()}))
document.addEventListener('click',event=>{if(!event.target.closest('.dropdown')){$('#dropdownMenu').setAttribute('aria-hidden','true');$('#dropdownButton').setAttribute('aria-expanded','false')}})
const modal=$('#modal'),open=$('#openModal'),save=$('#saveSettings')
function setBackground(inert){document.querySelector('main').inert=inert;$('.site-header').inert=inert;$('.site-footer').inert=inert}
open.addEventListener('click',()=>{setBackground(true);$('#darkMode').focus()})
function afterClose(){setBackground(false);open.focus()}
save.addEventListener('click',afterClose);$('#modalOverlay').addEventListener('click',afterClose);$('#closeSettings').addEventListener('click',()=>save.click())
$('#easyLanguage').addEventListener('change',()=>syncPresentation(false))
document.addEventListener('keydown',event=>{if(modal.classList.contains('hidden'))return;if(event.key==='Escape'){event.preventDefault();save.click();return}if(event.key==='Tab'){const focusable=[...modal.querySelectorAll('button,input')].filter(n=>!n.disabled);const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}})
syncPresentation()
