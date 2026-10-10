const events = [{
  id: 1,
  title: 'After Hours Live',
  poster: 'AFTER HOURS',
  category: 'Music',
  date: '2026-10-24',
  time: '6:00 PM',
  venue: 'Riverside Gardens',
  city: 'Accra',
  price: 150,
  description: 'An open-air evening of live bands, soulful sets, and good company. Bring your friends and settle in under the evening sky. Doors open at 5:30 PM.'
}, {
  id: 2,
  title: 'The Creative Table',
  poster: 'MAKE SOMETHING.',
  category: 'Workshops',
  date: '2026-10-31',
  time: '10:00 AM',
  venue: 'Studio Eleven',
  city: 'Accra',
  price: 90,
  description: 'Slow down and create something with your hands. A guided ceramics workshop for curious beginners. All materials and a welcome drink are included.'
}, {
  id: 3,
  title: 'Taste of the City',
  poster: 'A TASTE OF LOCAL.',
  category: 'Food & Drink',
  date: '2026-11-07',
  time: '12:00 PM',
  venue: 'Market Courtyard',
  city: 'Accra',
  price: 60,
  description: 'Meet independent cooks, discover local flavours, and enjoy an afternoon of food and music. Admission includes one tasting token; additional food is purchased separately.'
}, {
  id: 4,
  title: 'Ideas Worth Sharing',
  poster: 'WHAT COMES NEXT?',
  category: 'Conferences',
  date: '2026-11-14',
  time: '9:00 AM',
  venue: 'The Exchange Hall',
  city: 'Accra',
  price: 200,
  description: 'A day for fresh perspectives, thoughtful conversations, and new connections. Hear from a fictional line-up of makers and founders. Lunch is included.'
}, {
  id: 5,
  title: 'Sunday in Motion',
  poster: 'FIND YOUR FLOW.',
  category: 'Wellness',
  date: '2026-11-22',
  time: '7:00 AM',
  venue: 'Oceanfront Park',
  city: 'Accra',
  price: 40,
  description: 'Start your Sunday with gentle movement and a relaxed community walk. Suitable for beginners. Bring a mat, drinking water, and comfortable clothing.'
}, {
  id: 6,
  title: 'Art After Dark',
  poster: 'SEE THINGS DIFFERENTLY.',
  category: 'Arts & Culture',
  date: '2026-11-28',
  time: '7:00 PM',
  venue: 'The Open Gallery',
  city: 'Accra',
  price: 75,
  description: 'An evening of contemporary art, intimate performances, and conversation. Explore a curated demo exhibition at your own pace. Admission includes the full evening programme.'
}];
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  maximumFractionDigits: 0
}).format(n);
const dateText = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});
let category = 'All events';
let bookings = [];
try {
  const data = JSON.parse(localStorage.getItem('gather-bookings') || '[]');
  if (Array.isArray(data)) bookings = data.filter(b => events.some(e => e.id === b.eventId) &&
    Number.isInteger(b.quantity) && b.quantity >= 1 && b.quantity <= 8 && typeof b.id ===
    'string' && typeof b.name === 'string')
} catch {}
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
} [c]));

function render() {
  const query = $('#search').value.toLowerCase().trim(),
    from = $('#date').value;
  const visible = events.filter(e => (category === 'All events' || e.category === category) && (!
      from || e.date >= from) && `${e.title} ${e.venue} ${e.city} ${e.category}`.toLowerCase()
    .includes(query));
  $('#result-count').textContent = `${visible.length} events to explore`;
  $('#events').innerHTML = visible.map(e =>
      `<article class="card"><div class="event-art art-${e.id}"><span class="tag">${e.category}</span><strong>${e.poster}</strong></div><div class="card-content"><div class="card-top"><div class="date-box">${new Date(e.date+'T12:00:00').toLocaleString('en',{month:'short'}).toUpperCase()}<b>${e.date.slice(-2)}</b></div><div><h3>${e.title}</h3><p class="location">${e.venue}, ${e.city}<br>${e.time} · ${e.category}</p></div></div><div class="card-bottom"><span class="price">${money(e.price)}<small>/ person</small></span><button data-event="${e.id}" aria-label="View ${e.title}">Get tickets ↗</button></div></div></article>`
      ).join('') ||
    '<div class="empty"><h3>No events found</h3><p>Try another search or reset your filters.</p></div>';
  $('#ticket-count').textContent = bookings.reduce((s, b) => s + b.quantity, 0)
}
$('#categories').innerHTML = ['All events', ...new Set(events.map(e => e.category))].map(c =>
  `<button data-category="${c}" class="${c===category?'selected':''}" aria-pressed="${c===category}">${c}</button>`
  ).join('');
$('#categories').addEventListener('click', ev => {
  const b = ev.target.closest('button');
  if (!b) return;
  category = b.dataset.category;
  document.querySelectorAll('[data-category]').forEach(x => {
    x.classList.toggle('selected', x === b);
    x.setAttribute('aria-pressed', String(x === b))
  });
  render()
});
$('#search').addEventListener('input', render);
$('#date').addEventListener('change', render);
$('#reset').onclick = () => {
  $('#search').value = '';
  $('#date').value = '';
  $('#categories button').click()
};

function openModal(html) {
  $('#modal-body').innerHTML = html;
  if (!$('#modal').open) $('#modal').showModal()
}
$('#close-modal').onclick = () => $('#modal').close();
$('#modal').addEventListener('click', e => {
  if (e.target === $('#modal')) {
    const r = $('#modal').getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      $('#modal').close()
  }
});

function showEvent(id) {
  const e = events.find(e => e.id === id);
  if (!e) return;
  openModal(
      `<p class="eyebrow">${e.category} · DEMO EVENT</p><h2 id="modal-title">${e.title}</h2><p>${dateText(e.date)} · ${e.time}<br>${e.venue}, ${e.city}</p><p>${e.description}</p><form id="booking-form"><label>Your name<input name="name" autocomplete="name" required maxlength="80" placeholder="Name for your ticket"></label><label>Tickets<select name="quantity">${Array.from({length:8},(_,i)=>` <
      option value = "${i+1}" > $ {
        i + 1
      }
      $ {
        i ? 'tickets' : 'ticket'
      } < /option>`).join('')}</select > < /label><div class="total"><span>Total</span > < span id =
      "total" > $ {
        money(e.price)
      } < /span></div > < button class = "primary full"
      type = "submit" > Reserve tickets↗ <
      /button><p style="font-size:11px">Simulated reservation. No payment is taken. Tickets are saved in this browser and are not valid for entry.</p >
      < p id = "form-error"
      class = "error"
      role = "alert" > < /p></form >
      `);const form=$('#booking-form');form.quantity.onchange=()=>$('#total').textContent=money(e.price*Number(form.quantity.value));form.onsubmit=ev=>{ev.preventDefault();const name=form.elements.name.value.trim(),quantity=Number(form.quantity.value);if(!name){$('#form-error').textContent='Please enter your name.';return}if(!Number.isInteger(quantity)||quantity<1||quantity>8)return;const b={id:'GTH-'+crypto.randomUUID().slice(0,8).toUpperCase(),eventId:e.id,name,quantity,total:e.price*quantity,created:new Date().toISOString()};try{localStorage.setItem('gather-bookings',JSON.stringify([...bookings,b]))}catch{$('#form-error').textContent='Your browser could not save this reservation. Please allow browser storage and try again.';return}bookings.push(b);render();openModal(` <
      div class = "success-icon" > ✓ < /div><p class="eyebrow">YOU’RE ALL SET</p > < h2 id =
      "modal-title" > Something to look forward to. <
      /h2><p>${escapeHtml(b.name)}, your demo reservation for <strong>${e.title}</strong > is saved
      . < /p><div class="booking"><h3>${e.title}</h3 > < p > $ {
        dateText(e.date)
      }·
      $ {
        e.time
      } < br > $ {
        e.venue
      }, $ {
        e.city
      } <
      /p><p>${quantity} ${quantity===1?'ticket':'tickets'} · ${money(b.total)}<br>Booking ${b.id}</p >
      < /div><button class="primary full" id="download">Download ticket ↓</button > < p style =
      "font-size:11px" > This is a demo ticket.You can download it again from My tickets. <
      /p>`);$('#download').onclick=()=>download(b)}}
      document.addEventListener('click', e => {
        const b = e.target.closest('[data-event]');
        if (b) showEvent(Number(b.dataset.event))
      }); $('#history').onclick = () => {
        openModal(
          `<p class="eyebrow">YOUR PLANS, ALL IN ONE PLACE</p><h2 id="modal-title">My tickets</h2>${bookings.length?bookings.slice().reverse().map(b=>{const e=events.find(e=>e.id===b.eventId);return `<div class="booking"><h3>${e.title}</h3><p>${dateText(e.date)} · ${e.time}<br>${escapeHtml(b.name)} · ${b.quantity} tickets · ${money(e.price*b.quantity)}<br>${escapeHtml(b.id)}</p><button data-download="${escapeHtml(b.id)}">Download ticket ↓</button></div>`}).join(''):'<p>No tickets yet. Your next great moment is waiting.</p><button class="primary" id="browse">Discover events ↗</button>'}<p style="font-size:11px">Demo reservations stored only in this browser.</p>`
          );
        $('#browse')?.addEventListener('click', () => {
          $('#modal').close();
          $('#discover').scrollIntoView()
        });
        document.querySelectorAll('[data-download]').forEach(el => el.onclick = () => download(
          bookings.find(b => b.id === el.dataset.download)))
      };

      function download(b) {
        const e = events.find(e => e.id === b.eventId);
        const ticket =
          `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gather ticket — ${e.title}</title><style>body{font:16px Arial;background:#f4f5ed;padding:30px;color:#262725}main{max-width:620px;margin:40px auto;border:2px solid #262725;border-radius:20px;overflow:hidden}header{background:#262725;color:#d6f369;padding:30px;font-size:32px;font-weight:bold}section{padding:32px}h1{font-size:30px}p{line-height:1.8}footer{border-top:2px dashed #ccc;padding:25px 32px;font-size:12px}@media print{body{background:white;padding:0}main{margin:0}}</style><main><header>gather ✳</header><section><small>DEMO RESERVATION · NOT VALID FOR ENTRY</small><h1>${e.title}</h1><p>${dateText(e.date)} · ${e.time}<br>${e.venue}, ${e.city}</p><p><strong>Guest:</strong> ${escapeHtml(b.name)}<br><strong>Quantity:</strong> ${b.quantity}<br><strong>Total:</strong> ${money(e.price*b.quantity)}</p><p><strong>Booking reference</strong><br>${escapeHtml(b.id)}</p></section><footer>This simulated reservation does not provide admission to a real event. Open this file in a browser to print it or save as PDF.</footer></main></html>`;
        const url = URL.createObjectURL(new Blob([ticket], {
          type: 'text/html'
        }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `gather-ticket-${b.id}.html`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        $('#notice').textContent = 'Ticket downloaded. Open it to print or save as PDF.';
        $('#notice').style.display = 'block';
        setTimeout(() => $('#notice').style.display = 'none', 4000)
      }
      render();
