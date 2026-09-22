const PRODUCTS=[
  {id:"home-modern",name:"Modern Home Plate",cat:"home",price:1499,desc:"Clean, contemporary entrance nameplate."},
  {id:"apt-elegant",name:"Elegant Apartment Plate",cat:"apartment",price:1299,desc:"Compact personalised plate for apartment doors."},
  {id:"office-exec",name:"Executive Office Plate",cat:"office",price:1599,desc:"Professional door or cabin nameplate."},
  {id:"business-acrylic",name:"Business Acrylic Sign",cat:"business",price:1999,desc:"Custom sign for shops, studios and reception areas."}
];
const SIZES={"12 × 6 inch":0,"15 × 7 inch":300,"18 × 8 inch":650,"Custom size":900};
const FINISHES={"Black Acrylic":0,"Clear Acrylic":150,"Gold Mirror":350,"Frosted Acrylic":250};
const LIGHTS={"No Light":0,"Warm White":500,"Cool White":500,"RGB":750};
let cart=JSON.parse(localStorage.getItem("taf-cart")||"[]");

function money(n){return "₹"+Number(n||0).toLocaleString("en-IN");}
function saveCart(){localStorage.setItem("taf-cart",JSON.stringify(cart));}
function updateCart(){document.querySelectorAll("#cartCount").forEach(e=>e.textContent=cart.length);}
function productByName(name){return PRODUCTS.find(p=>p.name===name)||PRODUCTS[0];}

function productCard(p){
  return '<article class="product-card">'+
    '<div class="product-art"><div class="mini-plate"><strong>'+p.name+'</strong><small>THE ART FACTORY</small></div></div>'+
    '<div class="product-info"><span class="tag">'+p.cat+'</span><h3>'+p.name+'</h3><p>'+p.desc+'</p><p class="price">From '+money(p.price)+'</p>'+
    '<a class="btn btn-dark" href="customizer.html?product='+encodeURIComponent(p.name)+'">Customize</a></div></article>';
}

function renderProducts(){
  const featured=document.querySelector("#featuredProducts");
  if(featured) featured.innerHTML=PRODUCTS.map(productCard).join("");
  const shop=document.querySelector("#shopProducts");
  if(shop){
    const params=new URLSearchParams(location.search);
    const category=params.get("category");
    const filter=document.querySelector("#categoryFilter");
    if(filter && category) filter.value=category;
    const shown=category?PRODUCTS.filter(p=>p.cat===category):PRODUCTS;
    shop.innerHTML=shown.map(productCard).join("");
    if(filter) filter.onchange=()=>{const v=filter.value; location.href=v?"shop.html?category="+encodeURIComponent(v):"shop.html";};
  }
}

function priceFor(size,finish,light,base=1499){return base+(SIZES[size]||0)+(FINISHES[finish]||0)+(LIGHTS[light]||0);}

function initCustomizer(){
  const form=document.querySelector("#customForm");
  if(!form)return;
  const params=new URLSearchParams(location.search);
  const chosen=params.get("product");
  const p=productByName(chosen);
  const title=document.querySelector("#productTitle"); if(title)title.textContent=p.name;
  const priceEl=document.querySelector("#livePrice");
  const preview=document.querySelector("#namePreview");
  const numberPreview=document.querySelector("#numberPreview");
  const stylePreview=document.querySelector("#platePreview");
  const fields=()=>new FormData(form);
  function refresh(){
    const d=fields();
    const price=priceFor(d.get("size"),d.get("finish"),d.get("light"),p.price);
    if(priceEl)priceEl.textContent=money(price);
    if(preview)preview.textContent=d.get("name")||"YOUR NAME";
    if(numberPreview)numberPreview.textContent=d.get("number")||"HOUSE / FLAT NO.";
    if(stylePreview)stylePreview.dataset.variant=d.get("variant")||"1";
  }
  form.querySelectorAll("input,select").forEach(el=>el.addEventListener("input",refresh));
  refresh();
  form.onsubmit=e=>{
    e.preventDefault();
    const d=fields();
    const item={
      id:Date.now(),
      product:p.name,
      variant:d.get("variant"),
      name:d.get("name"),
      number:d.get("number"),
      size:d.get("size"),
      finish:d.get("finish"),
      light:d.get("light"),
      price:priceFor(d.get("size"),d.get("finish"),d.get("light"),p.price)
    };
    cart.push(item);saveCart();updateCart();
    location.href="cart.html";
  };
}

function initCart(){
  const el=document.querySelector("#cartItems");
  if(!el)return;
  const total=cart.reduce((s,x)=>s+Number(x.price||0),0);
  if(!cart.length){
    el.innerHTML='<div class="empty-state"><h2>Your cart is empty</h2><p>Start with a nameplate design and customise it to your space.</p><a class="btn btn-dark" href="shop.html">Browse Nameplates</a></div>';
    return;
  }
  el.innerHTML=cart.map((x,i)=>
    '<div class="cart-row"><div><b>'+x.product+'</b><div>'+x.name+(x.number?" · "+x.number:"")+'</div><small>Variant '+(x.variant||"1")+' · '+x.size+' · '+x.finish+' · '+x.light+'</small></div><div><b>'+money(x.price)+'</b><button class="remove-btn" data-i="'+i+'">Remove</button></div></div>'
  ).join("")+
  '<div class="cart-total"><span>Total</span><strong>'+money(total)+'</strong></div>'+
  '<a id="waOrder" class="btn btn-dark" href="#">Send Order on WhatsApp</a>';
  el.querySelectorAll(".remove-btn").forEach(btn=>btn.onclick=()=>{
    cart.splice(Number(btn.dataset.i),1);saveCart();location.reload();
  });
  const message=["Hello The Art Factory, I would like to place an order:",...cart.map((x,i)=>`${i+1}. ${x.product} | Name: ${x.name} | No: ${x.number||"-"} | Variant: ${x.variant||"1"} | Size: ${x.size} | Finish: ${x.finish} | Light: ${x.light} | Price: ${money(x.price)}`),`Total: ${money(total)}`].join("\n");
  const wa=document.querySelector("#waOrder");
  if(wa)wa.href="https://wa.me/919870539815?text="+encodeURIComponent(message);
}

function init(){
  updateCart();renderProducts();initCustomizer();initCart();
  const m=document.querySelector("#menuBtn"),n=document.querySelector("#mobileNav");
  if(m&&n)m.onclick=()=>n.classList.toggle("open");
}
document.addEventListener("DOMContentLoaded",init);