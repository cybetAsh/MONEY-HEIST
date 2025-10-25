// Central JS for auth + tools
(function(){
  // AUTH
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', e=>{
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();
      const err = document.getElementById('err');
      if(u === 'dineth ofc' && p === 'dineth ofc'){
        sessionStorage.setItem('logged','1');
        window.location = 'home.html';
      } else { err.textContent = 'Invalid credentials'; }
    });
  }

  // Protect pages except login
  const protectedPaths = ['home.html','catalogue.html','wp-link.html','wp-qr.html','about.html','contact.html'];
  const cur = window.location.pathname.split('/').pop();
  if(protectedPaths.includes(cur) && !sessionStorage.getItem('logged')){
    window.location = 'login.html';
  }

  const logout = document.getElementById('logout');
  if(logout) logout.addEventListener('click', ()=>{ sessionStorage.removeItem('logged'); window.location='login.html'; });

  // Catalogue page logic
  const photoInput = document.getElementById('photoInput');
  const previewWrap = document.getElementById('previewWrap');
  const createBtn = document.getElementById('createCatalogue');
  const downloads = document.getElementById('downloads');

  if(photoInput){
    let chosenImage = null;
    photoInput.addEventListener('change', e=>{
      const f = e.target.files[0];
      if(!f) return;
      const url = URL.createObjectURL(f);
      previewWrap.innerHTML = `<img id="theImg" src="${url}" alt="preview">`;
      createBtn.disabled = false;
      chosenImage = f;
    });

    createBtn.addEventListener('click', ()=>{
      downloads.innerHTML = '';
      const img = document.getElementById('theImg');
      if(!img) return alert('Please upload a photo first');
      // slice into 6 equal pieces (3 columns x 2 rows)
      img.onload = () => {
        const W = img.naturalWidth;
        const H = img.naturalHeight;
        const cols = 3, rows = 2;
        const w = Math.floor(W/cols);
        const h = Math.floor(H/rows);
        for(let r=0;r<rows;r++){
          for(let c=0;c<cols;c++){
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, c*w, r*h, w, h, 0,0,w,h);
            const data = canvas.toDataURL('image/jpeg',0.9);
            const a = document.createElement('a');
            a.href = data;
            a.download = `slice_r${r+1}_c${c+1}.jpg`;
            a.textContent = `Download slice ${r*cols + c +1}`;
            downloads.appendChild(a);
          }
        }
        // show message
        const msg = document.createElement('div');
        msg.textContent = 'Created 6 slices. Click to download each.';
        downloads.prepend(msg);
      };
      // force onload if already loaded
      if(img.complete) img.onload();
    });
  }

  // WP Link generator
  const genLinkBtn = document.getElementById('genLink');
  if(genLinkBtn){
    genLinkBtn.addEventListener('click', ()=>{
      const val = document.getElementById('wpNum').value.trim();
      if(!val) return alert('Enter a number');
      // normalize: remove + and non-digit
      const digits = val.replace(/\D/g,'');
      if(digits.length < 8) return alert('Number too short');
      const link = `https://wa.me/${digits}`;
      const result = document.getElementById('linkResult');
      result.innerHTML = `<div>Link: <input readonly value="${link}" id="waLink" style="width:100%"></div>
      <div style="margin-top:8px"><button id="copyLink">COPY LINK</button></div>`;
      document.getElementById('copyLink').addEventListener('click', ()=>{
        navigator.clipboard.writeText(link).then(()=>alert('Copied to clipboard'));
      });
    });
  }

  // WP QR generator
  const genQRBtn = document.getElementById('genQR');
  if(genQRBtn){
    genQRBtn.addEventListener('click', ()=>{
      const val = document.getElementById('qrNum').value.trim();
      if(!val) return alert('Enter a number');
      const digits = val.replace(/\D/g,'');
      const link = `https://wa.me/${digits}`;
      const qrResult = document.getElementById('qrResult');
      qrResult.innerHTML = '';
      // QRCode from qrcodejs (loaded only on wp-qr.html)
      new QRCode(qrResult, {text: link, width:200, height:200});
      const p = document.createElement('p'); p.textContent = link; qrResult.appendChild(p);
    });
  }

})();