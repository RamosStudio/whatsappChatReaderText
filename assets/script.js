const chatDiv = document.getElementById("chat");
    let messages = [], results = [], currentIndex = -1;

    document.getElementById("fileInput").addEventListener("change", async (e) => {
      const file = e.target.files[0]; if (!file) return;
      const text = await file.text();
      renderChat(text);
      requestAnimationFrame(() => scrollBottomChat());
    });

    function renderChat(chatText) {
      chatDiv.innerHTML = ""; messages = [];
      const lines = chatText.split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(" - ");
        if (parts.length < 2) continue;
        const msgPart = parts.slice(1).join(" - ");
        const senderSplit = msgPart.split(": ");
        if (senderSplit.length < 2) continue;
        const sender = senderSplit[0];
        const message = senderSplit.slice(1).join(": ");
        const msgDiv = document.createElement("div");
        const isMe = guessIsMe(sender);
        msgDiv.className = "msg " + (isMe ? "from" : "to");
        msgDiv.innerHTML = `<div class="sender">${sender}</div><div class="text">${message}</div>`;
        chatDiv.appendChild(msgDiv); messages.push(msgDiv);
      }
    }

    function guessIsMe(name){ return /ammar|عمّار|عمار/i.test(name); }

    function escapeRegExp(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
    function searchChat() {
      const term=document.getElementById("searchInput").value.trim(); if(!term) return;
      results=[]; currentIndex=-1;
      messages.forEach(m=>{
        m.querySelector(".text").innerHTML=m.querySelector(".text").innerHTML.replace(/<mark>|<\/mark>/g,"");
        if(m.innerText.includes(term)){
          results.push(m);
          m.querySelector(".text").innerHTML=m.querySelector(".text").innerHTML.replace(new RegExp(escapeRegExp(term),"gi"),t=>`<mark>${t}</mark>`);
        }
      });
      if(results.length){currentIndex=0;scrollToResult();} else alert("لا توجد نتائج");
    }
    function nextResult(){if(results.length){currentIndex=(currentIndex+1)%results.length;scrollToResult();}}
    function prevResult(){if(results.length){currentIndex=(currentIndex-1+results.length)%results.length;scrollToResult();}}
    function scrollToResult(){results[currentIndex].scrollIntoView({behavior:"smooth",block:"center"});}
    function scrollTopChat(){chatDiv.scrollTop=0;}
    function scrollBottomChat(){chatDiv.scrollTop=chatDiv.scrollHeight;}
    function toggleDark(){document.body.classList.toggle("dark");try{localStorage.setItem("chat_theme",document.body.classList.contains("dark")?"dark":"light");}catch(_){ }}
    (function(){try{if(localStorage.getItem("chat_theme")==="dark")document.body.classList.add("dark");}catch(_){}})();