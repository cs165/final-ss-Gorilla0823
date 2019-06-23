class Diary {
    constructor(id,date,text) {
        console.log('Diary');  
        this.prompts=this.prompts.bind(this);
        this.backward=this.backward.bind(this);
        this.forward=this.forward.bind(this);
        this.exit=this.exit.bind(this);
        this.edit=this.edit.bind(this);
        this.list=this.list.bind(this);
        this.delete=this.delete.bind(this);
        this.select=this.select.bind(this);
        this.timestring=this.timestring.bind(this);
        this.home=this.home.bind(this);
        this.id=id;
        this.date=date;
        this.text=text;
        this.prompts();
        const edit=document.querySelector('#subdiary');
        edit.addEventListener('click',this.edit);
        const exit=document.querySelector("#editmode");
        exit.addEventListener('click',this.exit);  
        const home=document.querySelector('#home');
        home.addEventListener('click',this.home);
        const back=document.querySelector('#backward');
        back.addEventListener('click',this.backward);
        const forward=document.querySelector('#forward');
        forward.addEventListener('click',this.forward);
        this.list();
        this.drop();
    }
    prompts(){
        console.log('Diary : prompts');
        console.log('ID= '+this.id);
        const prompt=document.querySelector('#prompts');
        prompt.innerText=prompts[Math.floor(Math.random()*prompts.length)].toUpperCase();
    }
    edit(){
        console.log('Diary : edit');
        document.querySelector("#control").classList.add('inactive');
        document.querySelector("#editmode").classList.remove('inactive');
        document.querySelector("#subdiary").classList.add('inactive');
        document.querySelector("#textarea").classList.remove('inactive');
        this.sorttextarea();
    }
    async exit(){
        console.log('Diary : exit');
        document.querySelector("#control").classList.remove('inactive');
        document.querySelector("#editmode").classList.add('inactive');
        document.querySelector("#subdiary").classList.remove('inactive');
        document.querySelector("#textarea").classList.add('inactive');
        var text=document.querySelector("#textarea").value;
        text=text.toString();
        text=text.replace(/\n/g,"\\n");
        const result = await fetch('/api/'+this.id,{ method : 'POST', 
            body:' { \"text\":\"'+text+'\" , \"delete\":\"false\"}',
            headers :{      'Accept': 'application/json',
                        'Content-Type': 'application/json'}}); 
        const json= await result.json();
        const result2 = await fetch('/api/'+this.id,{ method : 'GET' });
        const json2 = await result2.json();
        
        if(json2.text!==null&&json2.text!==undefined){
                document.querySelector("#textarea").value=json2.text;
                document.querySelector("#subdiary").innerText=json2.text;
        }
        else{
                document.querySelector("#textarea").value="";
                document.querySelector("#subdiary").innerText="";
        }
        this.sorttextarea();
        this.list();
        this.drop();
    }
    async home(){
        const today = new Date();
        const options = { month: 'long', day: 'numeric' };
        document.querySelector(".date").innerText=today.toLocaleDateString('en-US', options);
        this.date=today.toLocaleDateString();
        let token=this.date.split("/");
        if(token[1]<10) token[1]="0"+token[1];
        if(token[2]<10) token[2]="0"+token[2];
        const ID=token[0]+token[1]+token[2];
        this.id=ID;
        this.prompts();
        const result = await fetch('/api/'+this.id,{ method : 'GET' , 
          headers :{          'Accept': 'application/json',
                        'Content-Type': 'application/json'}}); 
        const json = await result.json();
        if(json.text!==undefined){
                document.querySelector("#textarea").value=json.text;
                document.querySelector("#subdiary").innerText=json.text;
        }
        else{
                document.querySelector("#textarea").value="";
                document.querySelector("#subdiary").innerText="";
        }
        this.sorttextarea();
        this.list();
    }
    async backward(){
        this.timestring();
        this.date= new Date(this.date);
        this.date.setDate(this.date.getDate() - 1);
        const options = { month: 'long', day: 'numeric' };
        document.querySelector(".date").innerText=this.date.toLocaleDateString('en-US', options);
        this.timestring2();
    }
    async forward(){
        this.timestring();
        this.date= new Date(this.date);
        this.date.setDate(this.date.getDate() + 1);
        const options = { month: 'long', day: 'numeric' };
        document.querySelector(".date").innerText=this.date.toLocaleDateString('en-US', options);
        this.timestring2();
    }
    timestring(){
        var values=this.id;
        var value= values.toString();
        var year=value[0]+value[1]+value[2]+value[3];
        var month;
        if(value[4]>0)
            month=value[4]+value[5];
        else
            month=value[5];
        var day=value[6]+value[7];
        this.date=month+'/'+day+'/'+year;
    }
    async timestring2(){
        const option = { year:'numeric',month: 'numeric', day: 'numeric' };
        let date2 = this.date.toLocaleDateString('en-US', option);
        let token=date2.split("/");
        if(token[0]<10) token[0]="0"+token[0];
        if(token[1]<10) token[1]="0"+token[1];
        const ID=token[2]+token[0]+token[1];
        this.id=ID;
        this.prompts();
        const result = await fetch('/api/'+this.id,{ method : 'GET' , 
          headers :{          'Accept': 'application/json',
                        'Content-Type': 'application/json'}}); 
        var json = await result.json();
        if(json.text!==undefined){
        document.querySelector("#textarea").value=json.text;
        document.querySelector("#subdiary").innerText=json.text;
        }
        else{
        document.querySelector("#textarea").value="";
        document.querySelector("#subdiary").innerText="";
        }
        this.sorttextarea();
        this.list();
    }
    list(){
        console.log('list');
        const words=document.querySelector("#subdiary").innerText;
        document.querySelector("#subdiary").innerText="";
        const lists=words.split("\n");
        var inner=[],count=0;
        for(let list of lists){
            if(list==="") continue;
            count++;
            inner.push(list);
            if(count>10) continue;
            const diary=document.querySelector("#subdiary");
            let div=document.createElement('div');
            div.setAttribute("class","subdiv");
            let image=document.createElement('i');
            image.setAttribute("class","fas fa-angle-double-right subimage");
            div.append(image);
            diary.append(div);
            var text=document.createTextNode(list);
            image.parentNode.insertBefore(text,image.nextSibling); 
            let trashcan=document.createElement('i');
            trashcan.setAttribute("class","fas fa-trash-alt subimage trashcan");
            div.append(trashcan); 
        }
        this.inner=inner;
        var empty = document.querySelectorAll('.trashcan');
        for(var i=0;i<empty.length;i++)
        empty[i].addEventListener('click',this.delete);
    }
    async delete(event){
            event.stopPropagation();
            var word=event.currentTarget.parentNode.textContent;
            var words="";
            var exist=false;
            var check= confirm("Are you sure you want to delete selected item?");
            if(check === true){
                for(var inner of this.inner){
                    if(inner!==word||exist===true)
                        words+=inner+"\\n";
                    else
                        exist=true;
                }
                const result = await fetch('/api/'+this.id,{ method : 'POST', 
                    body:' { \"text\":\"'+words+'\" , \"delete\":\"true\"}',
                    headers :{      'Accept': 'application/json',
                              'Content-Type': 'application/json'}}); 
                const json= await result.json();
                const result2 = await fetch('/api/'+this.id,{ method : 'GET' });
                const json2 = await result2.json();

                if(json2.text!==undefined&&json2.text!==null){
                    document.querySelector("#textarea").value=json2.text;
                    document.querySelector("#subdiary").innerText=json2.text;
                }
                else{
                    document.querySelector("#textarea").value="";
                    document.querySelector("#subdiary").innerText="";
                }
            }
            else return;

            this.sorttextarea();
            this.list();
            this.drop();
    }
    sorttextarea(){
        var text=document.querySelector("#textarea").value;
        var result="";
        var tokens=text.split(/\n/g);
        for(var token of tokens){
            if(/\S/.test(token))
                result+=token+"\u000a";
        }
        document.querySelector("#textarea").value=result;
    }
    async drop(){
        const result = await fetch('/createlist',{ method : 'GET' });
        const json = await result.json();
        var tokens=json.split("\\n");
        tokens.sort();
        var flag=false;
        const dropdown=document.querySelector(".dropdown");
        dropdown.innerText="";
        for(var token of tokens){
            if(token==="")continue;
            let li=document.createElement('li');
            li.setAttribute("class","menu-item sub-menu");
            let word=document.createElement('a');
            word.setAttribute("href","#");
            word.innerText=token;
            li.append(word);
            dropdown.append(li);         
        }
        var choose = document.querySelectorAll('.menu-item');
        for(var i=0;i<choose.length;i++)
            choose[i].addEventListener('click',this.select);
    }
    select(){
        event.stopPropagation();
        var word=event.currentTarget.textContent;
        this.id=word;
        this.timestring();
        this.date= new Date(this.date);
        const options = { month: 'long', day: 'numeric' };
        document.querySelector(".date").innerText=this.date.toLocaleDateString('en-US', options);
        this.timestring2();
    }
}
