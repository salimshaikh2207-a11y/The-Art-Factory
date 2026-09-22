const PRODUCTS=[
  {id:"signature-nameplate",name:"Signature Debossed Nameplate",cat:"home",price:999,desc:"Personalised acrylic debossed or frosted-glass nameplate with colour, size and lighting choices."},
  {id:"home-modern",name:"Modern Home Plate",cat:"home",price:1499,desc:"Clean, contemporary entrance nameplate."},
  {id:"office-exec",name:"Executive Office Plate",cat:"office",price:1599,desc:"Professional door or cabin nameplate."},
  {id:"business-acrylic",name:"Business Acrylic Sign",cat:"business",price:1999,desc:"Custom sign for shops, studios and reception areas."}
];
const SIZE_PRICES={"12 × 6 inch":0,"15 × 7 inch":300,"18 × 8 inch":550,"Custom size":1000};
const ACRYLIC_PLATE_PRICES={"Black":0,"White":0,"Royal Blue":0,"Wine Red":0,"Forest Green":0,"Gold Mirror":250,"Silver Mirror":200,"Custom colour":300};
const ACRYLIC_LETTER_PRICES={"Black":0,"White":0,"Gold":150,"Silver":120,"Red":80,"Blue":80,"Green":80,"Custom colour":180};
const GLASS_PLATE_PRICES={"White Glass":0,"Black Glass":0};
const GLASS_LETTER_PRICES={"Frosted":0};
const DIAMOND_PRICES={"None":0,"Gold Diamond":180,"Silver Diamond":160};
const LED_PRICES={"No LED":0,"Warm White LED":500,"Cool White LED":500,"RGB LED":750};
let cart=JSON.parse(localStorage.getItem("taf-cart")||"[]");
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN");}
function saveCart(){localStorage.setItem("taf-cart",JSON.stringify(cart));}
function updateCart(){document.querySelectorAll("#cartCount").forEach(e=>e.textContent=cart.length);}
function productByName(name){return PRODUCTS.find(p=>p.name===name)||PRODUCTS[0];}
function productCard(p){return '<article class="product-card"><div class="product-art"><div class="mini-plate"><strong>'+p.name+'</strong><small>THE ART FACTORY</small></div></div><div class="product-info"><span class="tag">'+p.cat+'</span><h3>'+p.name+'</h3><p>'+p.desc+'</p><p class="price">From '+money(p.price)+'</p><a class="btn btn-dark" href="customizer.html?product='+encodeURIComponent(p.name)+'">Customize</a></div></article>';}
function renderProducts(){
  const featured=document.querySelector("#featuredProducts"); if(featured)featured.innerHTML=PRODUCTS.slice(0,4).map(productCard).join("");
  const shop=document.querySelector("#shopProducts");
  if(shop){const params=new URLSearchParams(location.search);const category=params.get("category");const filter=document.querySelector("#categoryFilter");if(filter&&category)filter.value=category;const shown=category?PRODUCTS.filter(p=>p.cat===category):PRODUCTS;shop.innerHTML=shown.map(productCard).join("");if(filter)filter.onchange=()=>{const v=filter.value;location.href=v?"shop.html?category="+encodeURIComponent(v):"shop.html";};}
}
function fillSelect(id,items){const el=document.getElementById(id);if(!el)return;el.innerHTML=items.map(x=>'<option value="'+x+'">'+x+'</option>').join("");}
function customPrice(d,base){
  let total=base+(SIZE_PRICES[d.size]||0);
  if(d.material==="Acrylic Debossed"){total+=(ACRYLIC_PLATE_PRICES[d.plateColor]||0)+(ACRYLIC_LETTER_PRICES[d.letterColor]||0);}
  else{total+=(GLASS_PLATE_PRICES[d.plateColor]||0)+(GLASS_LETTER_PRICES[d.letterColor]||0)+(DIAMOND_PRICES[d.diamond]||0)+(LED_PRICES[d.led]||0);}
  return total;
}
function initCustomizer(){
  const form=document.querySelector("#customForm"); if(!form)return;
  const p=productByName(new URLSearchParams(location.search).get("product"));
  const title=document.querySelector("#productTitle"); if(title)title.textContent=p.name;
  const priceEl=document.querySelector("#livePrice"),previewName=document.querySelector("#namePreview"),previewNo=document.querySelector("#numberPreview"),previewText=document.querySelector("#platePreview");
  const materialEl=form.querySelector('[name="material"]');
  const glassExtras=document.querySelector("#glassExtras"),acrylicExtras=document.querySelector("#acrylicExtras"),letterHint=document.querySelector("#letterHint"),diamondWrap=document.querySelector("#diamondWrap"),ledWrap=document.querySelector("#ledWrap");
  function updatePreview(){
    const d=Object.fromEntries(new FormData(form).entries());
    if(priceEl)priceEl.textContent=money(customPrice(d,p.price));
    if(previewName)previewName.textContent=d.name||"YOUR NAME";
    if(previewNo)previewNo.textContent=d.number||"HOUSE / FLAT NO.";
    if(previewText){previewText.dataset.material=d.material||"Acrylic Debossed";previewText.dataset.plate=d.plateColor||"Black";previewText.dataset.letter=d.letterColor||"White";previewText.dataset.diamond=d.diamond||"None";previewText.dataset.led=d.led||"No LED";previewText.dataset.variant=d.variant||"1";}
  }
  function syncOptions(){
    const glass=materialEl.value==="Glass";
    fillSelect("plateColor",glass?Object.keys(GLASS_PLATE_PRICES):Object.keys(ACRYLIC_PLATE_PRICES));
    fillSelect("letterColor",glass?Object.keys(GLASS_LETTER_PRICES):Object.keys(ACRYLIC_LETTER_PRICES));
    fillSelect("diamond",Object.keys(DIAMOND_PRICES));
    fillSelect("led",Object.keys(LED_PRICES));
    if(glassExtras)glassExtras.style.display=glass?"block":"none";
    if(acrylicExtras)acrylicExtras.style.display=glass?"none":"block";
    if(letterHint)letterHint.textContent=glass?"Glass is supplied with frosted lettering.":"Choose the colour of your acrylic lettering.";
    if(diamondWrap)diamondWrap.style.display=glass?"block":"none";
    if(ledWrap)ledWrap.style.display=glass?"block":"none";
    if(!glass){const led=form.querySelector('[name="led"]');const diamond=form.querySelector('[name="diamond"]');if(led)led.value="No LED";if(diamond)diamond.value="None";}
    updatePreview();
  }
  form.querySelectorAll("input,select").forEach(el=>el.addEventListener("input",()=>{if(el.name==="material")syncOptions();else updatePreview();}));
  syncOptions();
  form.onsubmit=e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form).entries());
    const item={id:Date.now(),product:p.name,variant:d.variant,material:d.material,name:d.name,number:d.number,size:d.size,plateColor:d.plateColor,letterColor:d.letterColor,diamond:d.material==="Glass"?d.diamond:"None",led:d.material==="Glass"?d.led:"No LED",price:customPrice(d,p.price)};
    cart.push(item);saveCart();updateCart();location.href="cart.html";
  };
}
function initCart(){
  const el=document.querySelector("#cartItems"); if(!el)return;
  if(!cart.length){el.innerHTML='<div class="empty-state"><h2>Your cart is empty</h2><p>Start with a nameplate design and customise it to your space.</p><a class="btn btn-dark" href="shop.html">Browse Nameplates</a></div>';return;}
  const hasQuote=cart.some(x=>x.quote);
  const numericTotal=cart.reduce((sum,x)=>sum+(x.quote?0:Number(x.price||0)),0);
  el.innerHTML=cart.map((x,i)=>{
    const extras=x.design?(" · Design: "+x.design+" · Shape: "+x.shape+" · Language: "+x.language+" · Font: "+x.font+" · LED: "+x.led):("");
    const pricing=x.quote?"Quote on request":money(x.price);
    return '<div class="cart-row"><div><b>'+x.product+'</b><div>'+x.name+(x.number?" · "+x.number:"")+'</div><small>'+x.material+' · '+x.size+extras+(x.plateColor?" · Plate: "+x.plateColor:"")+(x.letterColor?" · Letters: "+x.letterColor:"")+(x.diamond?" · Diamond: "+x.diamond:"")+'</small></div><div><b>'+pricing+'</b><button class="remove-btn" data-i="'+i+'">Remove</button></div></div>';
  }).join("")+'<div class="cart-total"><span>'+ (hasQuote?"Estimated total":"Total") +'</span><strong>'+ (hasQuote?"Quote required":money(numericTotal)) +'</strong></div><a id="waOrder" class="btn btn-dark" href="#">Send Order on WhatsApp</a>';
  el.querySelectorAll(".remove-btn").forEach(btn=>btn.onclick=()=>{cart.splice(Number(btn.dataset.i),1);saveCart();location.reload();});
  const lines=["Hello The Art Factory, I would like to place an order:"];
  cart.forEach((x,i)=>{
    if(x.quote){
      lines.push((i+1)+". "+x.product+" | Material: "+x.material+" | Design: "+x.design+" | Shape: "+x.shape+" | Name: "+x.name+" | No: "+(x.number||"-")+" | Size: "+x.size+" | Language: "+x.language+" | Font: "+x.font+" | Letters: "+x.letterColor+" | LED: "+x.led+" | Price: Quote on request");
    }else{
      lines.push((i+1)+". "+x.product+" | Material: "+x.material+" | Name: "+x.name+" | No: "+(x.number||"-")+" | Size: "+x.size+" | Plate: "+x.plateColor+" | Letters: "+x.letterColor+(x.material==="Glass"?" | Diamond: "+x.diamond+" | LED: "+x.led:"")+" | Price: "+money(x.price));
    }
  });
  if(hasQuote)lines.push("Pricing: Quote required for one or more customised items.");
  else lines.push("Total: "+money(numericTotal));
  const wa=document.querySelector("#waOrder"); if(wa)wa.href="https://wa.me/919870539815?text="+encodeURIComponent(lines.join("\n"));
}
