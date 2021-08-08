window.onload = function(){
  init_devices( )
}

function init_devices(  ){
  fetch("/api/devices").then(res => {
    if( res.status == 200  || res.status == 302){
      res.json().then( apply_devices );
    }else{
      alert("failed");
    }
  });
}

function apply_devices( data ){
  console.log( data );
  let container = document.querySelector("#devices");

  for( let d of data ){
    let div = createElement("div", {class:"container border"}),
        form = createElement("form", {onsubmit: () => {
          set_status( d.uid, form.status.value );
          return false;
        }});
    let head = createElement("p", {innerText: d.name});
    let status = createElement("input", {type:"hidden", value:"1", name:"status"});
    let onBtn = createElement("button", {innerText:"ON", onclick: () => {
      status.value = 1;
      // form.onsubmit();
    }});
    let offBtn = createElement("button", {innerText:"OFF", onclick: () => {
      status.value = 0;
      // form.onsubmit();
    }});
    div.appendChild(head);
    form.appendChild( status );
    form.appendChild( onBtn );
    form.appendChild( offBtn );
    div.appendChild( form )
    container.appendChild( div );
  }
}

function set_status( uid, s ){
  fetch("/api/status", {
    method:"POST",
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({ uid, status: (s) })
  }).then( r => {
    console.log( r );
  });
}

const createElement = (tag, obj) => {
  let el = document.createElement(tag);
  if(typeof obj=="object"){
    let list = Object.keys(obj);
    for(var i=0;i<list.length;i++){
      let key = list[i];
      if(typeof obj[key]!='object'){
        el[key] = obj[key];
      }else
        for(let k of Object.keys(obj[key])){
          el[key][k] = obj[key][k];
        }
    }
  }
  return el;
}