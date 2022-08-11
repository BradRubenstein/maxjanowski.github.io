function setupMessageCounter(textareaId = "message", counterId = "counter") {
  document.getElementById(textareaId).onkeyup = (e) => {
    const counter = document.getElementById(counterId);
    counter.innerHTML = `${e.target.value.length}/${e.target.maxLength}`;
    counter.style.visibility = 'visible';
  };
}

// Control code for /order form
function setupPledgeControl() {
  const pledgeamt = document.getElementById("pledgeamt");
  function updateamt(e) {
    if (e.target.checked) {
      pledgeamt.value = e.target.value;
    }
  }
  pledgeamt.onfocus = ((e) => {
    document.getElementById("pledgeother").checked = true;
  });
  [ "pledge250", "pledge50" ].forEach( (id) => {
    document.getElementById(id).onchange = updateamt;
  });
}

function loadZipLinks(e) {
  let list = fetch('/assets/downloads.json')
    .then( res => res.json())
    .then ( res => {
      const list = res.filter( e => e['MimeType'] === 'application/zip' )
      .map( e => {
        const [x,sku,title] = /([0-9]+)\s*(.*)\.zip/.exec(e['Name']);
        const url = `https://drive.google.com/file/d/${e['ID']}/view`
        return { sku, url, title }
      })
      .sort((a,b)=> {
        return a['title'].toLowerCase().localeCompare(b['title'].toLowerCase());
      })
      .map( e => {
        return `<div>${e.sku}</div><div>
            <a href="${e.url}" title="Access and download this piece." target="_blank">
              ${e.title}
            </a>
          </div>`;
      });
      e.innerHTML = '<div>Number</div><div>Title</div>'+list.join('');
      console.log(list)
    });
  return true;
}

function loadEditionPage(e) {
  const doc = e.target;

  id = new URL(doc.URL).searchParams.get('id')
  fetch('/assets/editions.json')
    .then ( res => res.json())
    .then ( res => {
      let item = res.find((e) => e['id'] === id);
      if (!item) {
        location.href = '/404';
        return false;
      }
      Object.keys(item).forEach(k => {
        const v = item[k];
        if ( k == 'title' ) {
          doc.title = v + ' | The Max Janowski Society';
        }
        if ( k == 'sheetPreviewId' ) {
          doc.getElementById('preview-image').onload = e => (e.target.style.opacity = 1);
          doc.getElementById('preview-image').src = `//drive.google.com/uc?export=view&id=${v}`;
        }
        if ( k == 'zipFileId' ) {
          doc.getElementById('zipFileUrl').href = `https://drive.google.com/file/d/${v}/view`;

        }
        n = doc.getElementById(k);
        if (n) {
          n.innerHTML = v;
        }
      })
      doc.getElementById('edition-landing').style.opacity = "1";
    })
  return true;
}
