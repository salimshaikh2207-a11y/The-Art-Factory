const ENGRAVED_DESIGNS={
  "Classic Border":{shape:"Rectangle",image:"assets/engraved-classic-border.svg"},
  "Botanical Corner":{shape:"Rectangle",image:"assets/engraved-botanical-corner.svg"},
  "Decorative Panel":{shape:"Rectangle",image:"assets/engraved-decorative-panel.svg"},
  "Luxe LED":{shape:"Rectangle",image:"assets/engraved-luxe-led.svg"}
};
const FONTS={
  English:["Montserrat — Modern","Poppins — Premium","DM Sans — Minimal","Lato — Classic","Nunito Sans — Friendly"],
  Hindi:["Noto Sans Devanagari — Modern","Mukta — Indian / Balanced","Hind — Minimal / Modern","Anek Devanagari — Contemporary","Khand — Stylish / Narrow"],
  Marathi:["Noto Sans Devanagari — Modern","Mukta — Indian / Balanced","Hind — Minimal / Modern","Anek Devanagari — Contemporary","Khand — Stylish / Narrow"]
};
const DEBOSS_DESIGNS=["Design 01","Design 02","Design 03","Design 04"];
const EMBOSSED_DESIGNS=["Design 01","Design 02","Design 03","Design 04"];
const DEBOSS_PLATES=["Black","White","Matte Black"];
const DEBOSS_LETTERS=["Gold","Silver","Rose Gold"];
const ACRYLIC_PLATES=["Black","White","Matte Black","Red","Royal Blue","Navy Blue","Forest Green","Wine Red/Burgundy","Grey","Cream/Ivory","Gold Mirror","Silver Mirror","Rose Gold Mirror","Copper Mirror"];
const ACRYLIC_LETTERS=["Gold","Silver","Rose Gold","White","Black","Red","Royal Blue","Navy Blue","Forest Green","Wine Red/Burgundy","Copper","Champagne Gold","Metallic Blue","Metallic Green"];
const GLASS_LETTER_COLORS=["Gold","Silver","Rose Gold","White","Black","Red","Royal Blue","Navy Blue","Forest Green","Wine Red/Burgundy","Copper","Champagne Gold","Metallic Blue","Metallic Green"];
const SIZES_DEBOSS=["8 × 6 inch","12 × 6 inch","16 × 8 inch","24 × 8 inch","Custom Size"];
const SIZES_STANDARD=["8 × 6 inch","12 × 6 inch","16 × 8 inch","24 × 8 inch","Custom Size"];
const SIZES_ENGRAVED=["12 × 6 inch","16 × 8 inch","24 × 8 inch","Custom Size"];
const SHAPES=["Rectangle","Round","Capsule"];
const LEDS=["No LED","Warm White LED","Cool White LED","RGB LED"];
const DIAMONDS=["None","Gold Diamond","Silver Diamond"];

let cart=JSON.parse(localStorage.getItem("taf-cart")||"[]");

function saveCart(){localStorage.setItem("taf-cart",JSON.stringify(cart));}
function updateCart(){document.querySelectorAll("#cartCount").forEach(e=>e.textContent=cart.length);}
function fillSelect(id,items){const el=document.getElementById(id);if(!el)return;el.innerHTML=items.map(x=>'<option value="'+x+'">'+x+'</option>').join("");}
function fillRadioGrid(name,items,labels,checkedIndex=0){
  return items.map((x,i)=>'<label class="variant-option"><input type="radio" name="'+name+'" value="'+x+'"'+(i===checkedIndex?" checked":"")+'><span>'+x+'</span><small>'+((labels&&labels[x])||"Standard option")+'</small></label>').join("");
}
function escapeHtml(v){return String(v||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));}

function initGenericCustomizer(){
  const workspace=document.getElementById("customizerWorkspace");
  const form=document.getElementById("genericForm");
  if(!workspace||!form)return;
  const category=new URLSearchParams(location.search).get("category");
  if(!category){return;}
  document.getElementById("categoryChooser").style.display="none";
  workspace.style.display="block";
  const title=document.getElementById("customizerTitle");
  const lead=document.getElementById("customizerLead");
  const namePreview=document.getElementById("genericName");
  const numberPreview=document.getElementById("genericNumber");
  const plate=document.getElementById("genericPlate");
  const spec={};
  if(category==="debossed"){
    spec.title="Debossed · Customise your nameplate";
    spec.lead="Two-layer acrylic construction. No LED.";
    form.innerHTML=
      '<fieldset><legend>1. Design</legend><div class="variant-grid">'+fillRadioGrid("design",DEBOSS_DESIGNS,null)+'</div><span class="field-note">Each design is a fixed production template with its own border.</span></fieldset>'+
      '<label>2. Shape<select name="shape">'+SHAPES.map(x=>'<option>'+x+'</option>').join("")+'</select></label>'+
      '<label>3. Size<select name="size">'+SIZES_DEBOSS.map(x=>'<option>'+x+'</option>').join("")+'</select></label>'+
      '<label>4. Plate Colour<select name="plateColor">'+DEBOSS_PLATES.map(x=>'<option>'+x+'</option>').join("")+'</select></label>'+
      '<label>5. Letter / Backing Colour<select name="letterColor">'+DEBOSS_LETTERS.map(x=>'<option>'+x+'</option>').join("")+'</select><span class="field-note">Gold, Silver and Rose Gold are standard. Other colours → Contact Us.</span></label>'+
      '<label>6. Name / Main Text<input name="name" maxlength="40" placeholder="e.g. Salim Shaikh" required></label>'+
      '<label>7. House / Flat Number<input name="number" maxlength="20" placeholder="e.g. 1603"></label>'+
      '<label>8. Language<select name="language"><option>English</option><option>Hindi</option><option>Marathi</option></select></label>'+
      '<label>9. Font<select id="genericFont" name="font"></select></label>'+
      '<div class="panel" style="margin-top:18px"><p class="eyebrow">PRODUCTION</p><p class="muted">Minimum finished letter height: <strong>1 inch / 25.4 mm</strong>. LED is not available on Debossed.</p></div>'+
      '<p class="muted">Custom colours, artwork, logos, borders, unusual shapes or dimensions → Contact Us.</p>'+
      '<button class="btn btn-dark full" type="submit">Add to Cart & Continue</button>';
  }else if(category==="embossed"){
    spec.title="Embossed · Customise your nameplate";
    spec.lead="Choose Acrylic or Glass. Glass supports Frosted or Raised Acrylic letters, with diamond available only for Frosted letters.";
    form.innerHTML=
      '<fieldset><legend>1. Material</legend><div class="variant-grid">'+fillRadioGrid("material",["Acrylic","Glass"],{"Acrylic":"Raised acrylic letters","Glass":"Black or White Glass"})+'</div></fieldset>'+
      '<label>2. Shape<select name="shape">'+SHAPES.map(x=>'<option>'+x+'</option>').join("")+'</select></label>'+
      '<label>3. Design<select name="design">'+EMBOSSED_DESIGNS.map(x=>'<option>'+x+'</option>').join("")+'</select><span class="field-note">Four fixed production designs; each includes its own border.</span></label>'+
      '<label>4. Size<select name="size">'+SIZES_STANDARD.map(x=>'<option>'+x+'</option>').join("")+'</select></label>'+
      '<label>5. Name / Main Text<input name="name" maxlength="40" placeholder="e.g. Salim Shaikh" required></label>'+
      '<label>6. House / Flat Number<input name="number" maxlength="20" placeholder="e.g. 1603"></label>'+
      '<label>7. Language<select name="language"><option>English</option><option>Hindi</option><option>Marathi</option></select></label>'+
      '<label>8. Font<select id="genericFont" name="font"></select></label>'+
      '<label>9. Plate Colour<select id="embossPlate" name="plateColor"></select></label>'+
      '<label>10. Letter Type<select id="embossLetterType" name="letterType"><option>Raised Acrylic</option><option>Frosted</option></select></label>'+
      '<label id="embossLetterColorWrap">Letter Colour<select id="embossLetterColor" name="letterColor"></select><span class="field-note">Standard and premium acrylic letter colours.</span></label>'+
      '<label id="embossDiamondWrap" style="display:none">Diamond Backdrop<select name="diamond">'+DIAMONDS.map(x=>'<option>'+x+'</option>').join("")+'</select><span class="field-note">Diamond backdrop is available only with Frosted letters on Glass.</span></label>'+
      '<label>LED<select name="led">'+LEDS.map(x=>'<option>'+x+'</option>').join("")+'</select><span class="field-note">LED is available on Acrylic and Glass.</span></label>'+
      '<div class="panel" style="margin-top:18px"><p class="eyebrow">PRODUCTION</p><p class="muted">Minimum finished letter height: <strong>1 inch / 25.4 mm</strong>. Other materials/finishes → Contact Us.</p></div>'+
      '<button class="btn btn-dark full" type="submit">Add to Cart & Continue</button>';
  }else{return;}

  title.textContent=spec.title;
  lead.textContent=spec.lead;
  const materialInputs=Array.from(form.querySelectorAll('[name="material"]'));
  const language=form.querySelector('[name="language"]');
  const font=document.getElementById("genericFont");
  const plateColor=form.querySelector('[name="plateColor"]');
  const letterType=form.querySelector('[name="letterType"]');
  const letterColor=form.querySelector('[name="letterColor"]');
  const diamondWrap=document.getElementById("embossDiamondWrap");
  const letterColorWrap=document.getElementById("embossLetterColorWrap");

  function syncFonts(){
    const lang=language?.value||"English";
    fillSelect("genericFont",FONTS[lang]||FONTS.English);
    updatePreview();
  }
  function syncEmboss(){
    if(category!=="embossed")return;
    const mat=form.querySelector('[name="material"]:checked')?.value||"Acrylic";
    if(plateColor)fillSelect("embossPlate",mat==="Glass"?["Black Glass","White Glass"]:ACRYLIC_PLATES);
    if(letterType){
      if(mat==="Glass"){
        letterType.innerHTML='<option>Raised Acrylic</option><option>Frosted</option>';
      }else{
        letterType.innerHTML='<option>Raised Acrylic</option>';
      }
    }
    const isGlass=mat==="Glass";
    const frosted=isGlass && letterType?.value==="Frosted";
    if(letterColorWrap)letterColorWrap.style.display=frosted?"none":"block";
    if(letterColor)fillSelect("embossLetterColor",frosted?["Frosted"]:ACRYLIC_LETTERS);
    if(diamondWrap)diamondWrap.style.display=frosted?"block":"none";
    const diamond=form.querySelector('[name="diamond"]');
    if(!frosted&&diamond)diamond.value="None";
    updatePreview();
  }
  function updatePreview(){
    const d=Object.fromEntries(new FormData(form).entries());
    if(namePreview)namePreview.textContent=d.name||"YOUR NAME";
    if(numberPreview)numberPreview.textContent=d.number||"HOUSE / FLAT NO.";
    if(plate){
      plate.dataset.material=d.material||category;
      plate.dataset.plate=d.plateColor||"Black";
      plate.dataset.letter=d.letterColor||d.letterType||"Gold";
      plate.dataset.led=d.led||"No LED";
      plate.dataset.shape=d.shape||"Rectangle";
    }
  }

  form.querySelectorAll("input,select").forEach(el=>el.addEventListener("input",()=>{if(el.name==="language")syncFonts();else if(el.name==="material"||el.name==="letterType")syncEmboss();else updatePreview();}));
  if(language)syncFonts();
  if(category==="embossed")syncEmboss();
  updatePreview();

  form.onsubmit=e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form).entries());
    const item={id:Date.now(),product:category==="debossed"?"Debossed Nameplate":"Embossed Nameplate",quote:true,category,...d};
    if(category==="embossed" && d.material==="Glass" && d.letterType==="Frosted"){item.diamond=d.diamond||"None";}else{item.diamond="None";}
    cart.push(item);saveCart();updateCart();location.href="cart.html";
  };
}

function initEngravedCustomizer(){
  const form=document.getElementById("engravedForm"); if(!form)return;
  const design=document.getElementById("engravedDesign");
  const image=document.getElementById("engravedPreviewImage");
  const namePreview=document.getElementById("engravedNamePreview");
  const numberPreview=document.getElementById("engravedNumberPreview");
  const title=document.getElementById("engravedTitle");
  const font=document.getElementById("engravedFont");
  const language=form.querySelector('[name="language"]');
  const params=new URLSearchParams(location.search);
  fillSelect("engravedDesign",Object.keys(ENGRAVED_DESIGNS));
  const wanted=params.get("design");if(wanted&&ENGRAVED_DESIGNS[wanted])design.value=wanted;
  function syncFonts(){fillSelect("engravedFont",FONTS[language.value]||FONTS.English);update();}
  function update(){
    const d=Object.fromEntries(new FormData(form).entries());
    const info=ENGRAVED_DESIGNS[d.design]||ENGRAVED_DESIGNS["Classic Border"];
    if(image){image.src=info.image;image.alt=d.design+" nameplate preview";}
    if(title)title.textContent=(d.design?d.design+" · ":"")+"Create your nameplate";
    if(namePreview)namePreview.textContent=d.name||"YOUR NAME";
    if(numberPreview)numberPreview.textContent=d.number||"HOUSE / FLAT NO.";
  }
  language.addEventListener("change",syncFonts);
  form.querySelectorAll("input,select").forEach(el=>el.addEventListener("input",update));
  syncFonts();
  form.onsubmit=e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form).entries());
    const info=ENGRAVED_DESIGNS[d.design]||ENGRAVED_DESIGNS["Classic Border"];
    cart.push({id:Date.now(),product:"Engraved & Charcoal Nameplate",quote:true,design:d.design,shape:info.shape,material:d.material,name:d.name,number:d.number,size:d.size,language:d.language,font:d.font,letterColor:d.letterColor,led:d.led,price:null});
    saveCart();updateCart();location.href="cart.html";
  };
}

function initCart(){
  const el=document.querySelector("#cartItems");if(!el)return;
  if(!cart.length){el.innerHTML='<div class="empty-state"><h2>Your cart is empty</h2><p>Choose a product category to start.</p><a class="btn btn-dark" href="shop.html">Browse Nameplates</a></div>';return;}
  const itemHtml=cart.map((x,i)=>{
    const details=[];
    if(x.category)details.push(x.category);
    if(x.design)details.push("Design: "+x.design);
    if(x.shape)details.push("Shape: "+x.shape);
    if(x.material)details.push("Material: "+x.material);
    if(x.size)details.push("Size: "+x.size);
    if(x.plateColor)details.push("Plate: "+x.plateColor);
    if(x.letterType)details.push("Letter type: "+x.letterType);
    if(x.letterColor)details.push("Letters: "+x.letterColor);
    if(x.language)details.push("Language: "+x.language);
    if(x.font)details.push("Font: "+x.font);
    if(x.diamond&&x.diamond!=="None")details.push("Diamond: "+x.diamond);
    if(x.led)details.push("LED: "+x.led);
    return '<div class="cart-row"><div><b>'+escapeHtml(x.product)+'</b><div>'+escapeHtml(x.name)+(x.number?" · "+escapeHtml(x.number):"")+'</div><small>'+details.map(escapeHtml).join(" · ")+'</small></div><div><b>Quote on request</b><button class="remove-btn" data-i="'+i+'">Remove</button></div></div>';
  }).join("");
  el.innerHTML=itemHtml+'<div class="cart-total"><span>Order total</span><strong>Quote on request</strong></div><a id="waOrder" class="btn btn-dark" href="#">Send Order on WhatsApp</a>';
  el.querySelectorAll(".remove-btn").forEach(btn=>btn.onclick=()=>{cart.splice(Number(btn.dataset.i),1);saveCart();location.reload();});
  const lines=["Hello The Art Factory, I would like to place an order:"];
  cart.forEach((x,i)=>{
    const parts=[(i+1)+". "+(x.product||"Nameplate")];
    ["category","design","shape","material","size","name","number","plateColor","letterType","letterColor","language","font","diamond","led"].forEach(k=>{if(x[k]&&x[k]!=="None")parts.push(k+": "+x[k]);});
    parts.push("Price: Quote on request");lines.push(parts.join(" | "));
  });
  lines.push("Please share the final quote and design approval details.");
  const wa=document.querySelector("#waOrder");if(wa)wa.href="https://wa.me/919870539815?text="+encodeURIComponent(lines.join("\n"));
}

function init(){
  updateCart();
  initGenericCustomizer();
  initEngravedCustomizer();
  initCart();
  const m=document.querySelector("#menuBtn"),n=document.querySelector("#mobileNav");
  if(m&&n)m.onclick=()=>n.classList.toggle("open");
}
document.addEventListener("DOMContentLoaded",init);
