const modal = document.getElementById("modal")
const gameover_show_re = document.getElementById("gameover")
const gs = document.getElementById("game-setting")
const submit_category = document.getElementById("submit-category")
const submit_category_check = document.getElementById("submit-category_check")
const check_school_number=document.querySelectorAll('.content span')[2];
const sp = document.getElementById("start-page")
const check_imoji = document.getElementById("submit-schoolnumber")
const check_imoji_check = document.getElementById("submit-schoolnumber_check")
const check_category=document.querySelectorAll('.content span')[5];
const cursor = document.querySelector('.cursor')
const holes = [...document.querySelectorAll('.mole')]
const hole_out = new Array(holes.length).fill(0);
const mole_ans = new Array(holes.length).fill(0);
const scoreEl = document.querySelector('.score span')
const final_score = document.querySelector('.final-score span')
const TIMER=document.querySelector('.timer span');
const PB=document.getElementById('problem');
const game_start_button = document.getElementById("start-img-button")
let score = 0
let answer = 0 
let percent=[1,holes.length]
let last_percent=[1,holes.length]
let user_School_Number = 0
let game_mode = 0
let start_time = 0
let game_finish = 0
let last_game = 0
let category = 0
let category_list = ["로그","지수","수열"]
let before_start_setting = [0,0] // 학번 입력, 게임 유형 선택
let game_play_time = 60
let problem_score=[0,0]
let game_record = []
let params={}
let record_style={
    "category":"",
    "problem":"",
    "problem_answer":"",
    "user_answers":""
}
let correct_pb_cnt = 0
let wrong_pb_cnt = 0

let audio = new Audio('./audio/atteck.mp3');
let correct = new Audio('./audio/correct.mp3');

const domain = "https://mathgame.bass9030.dev" //"http://127.0.0.1:8000"//

function pow(a,b){
    return Math.pow(a,b)
}

function fastapi(method,url, params){
    
    if(method=='post'){
        var xhr = new XMLHttpRequest();

        xhr.open("POST", url, true);

        // Set headers
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Request was successful
                console.log(xhr.responseText);
            } else {
                // Handle errors or other status codes here
                console.error(xhr.statusText);
            }
        };

        xhr.send(params);
    }else if(method=='get'){
        //fastapi(domain+"/api/record/create/"+String(user_School_Number), params)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('통신 성공!');
                console.log(xhr.responseText,JSON.parse(xhr.responseText).user_exit);
                console.log(JSON.parse(xhr.responseText).user_exit==true)
            } else {
                console.error('통신 실패!');
            }
        }
        };

        xhr.send();
    }



    /*
    fetch(_url, options)
        .then(response => {  fetch 를 통해 들어온 값이 then 의 response 에 입력되서 then 안에 있는 임의 함수를 실행함
            
        if(response.status === 204) {  // No content
                if(success_callback) {
                    success_callback()
                }
                return
            }
            console.log("response")
            console.log(response)

            response.json()
                .then(json => {


                    if(response.status >= 200 && response.status < 300) {  // 200 ~ 299
                        if(success_callback) {                 

                            success_callback(json)
                        
                        }
                        return

                    }else {
                        if (failure_callback) {
                            failure_callback(json)
                        }else {
                            console.log('!!')
                            console.log(json)
                            console.log(JSON.stringify(json))
                        }
                    }
                })
                .catch(error => {
                    console.log('error')
                    console.log(error)
                    console.log(JSON.stringify(error))
                })
        })
        */
}
const user_available_check = (url,succes_callback,failure_callback) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            // console.log('통신 성공!');
            // console.log(xhr.responseText,JSON.parse(xhr.responseText).user_exit);
            // console.log(JSON.parse(xhr.responseText).user_exit==true)
            succes_callback(JSON.parse(xhr.responseText))
        } else {
            failure_callback()
            // console.error('통신 실패!');
        }
    }
    };

    xhr.send();
}


function ord(v){
    return String.fromCharCode(v)
}

function gamerule(){

}

function setting_game(){
    gs.style.display = "inline"
    sp.style.display = "none"
    check_imoji.style.display="none"
    check_imoji_check.style.display="none"
    submit_category.style.display="none"
    submit_category_check.style.display="none"
    check_category.textContent=""
    game_start_button.style.display="none"
    before_start_setting=[0,0]

}


function click2start(){
    user_available_check(domain+'/api/user/user-exist/'+String(user_School_Number),(json)=>{
        if(json.user_exit){
            check_imoji.style.display="inline"
            check_imoji_check.style.display="inline"
            check_school_number.textContent = "학번 :"+user_School_Number
            before_start_setting[0]=1
            if(before_start_setting[0]==1 && before_start_setting[1]==1){
                game_start_button.style.display="inline"
            }
        }else{
            before_start_setting[0]=0
            check_imoji.style.display="inline"
            check_imoji_check.style.display="none"
            check_school_number.textContent = "존재하지 않는 학번입니다."
            game_start_button.style.display="none"
        }
    },
    ()=>{
        before_start_setting[0]=0
        check_imoji.style.display="inline"
        check_imoji_check.style.display="none"
        check_school_number.textContent = "다시 시도해주세요."
        game_start_button.style.display="none"
    })

}
function set_category(input_category){
    if(category_list.includes(String(input_category))){
        category=input_category
        submit_category.style.display="inline"
        submit_category_check.style.display="inline"
        check_category.textContent = "유형 : " + category
        before_start_setting[1]=1
        if(before_start_setting[0]==1 && before_start_setting[1]==1){
            game_start_button.style.display="inline"
        }
    }else{
        alert('올바르지 않은 카테고리')
    }

}

function school_number(e){ // value + ord(keyCode) : 입력한 숫자
    if(e.keyCode === 13){ //13 이 엔터 입력
        user_available_check(domain+'/api/user/user-exist/'+String(user_School_Number),(json)=>{
            if(json.user_exit){
                check_imoji.style.display="inline"
                check_imoji_check.style.display="inline"
                check_school_number.textContent = "학번 :"+user_School_Number
                before_start_setting[0]=1
                if(before_start_setting[0]==1 && before_start_setting[1]==1){
                    game_start_button.style.display="inline"
                }
            }else{
                before_start_setting[0]=0
                check_imoji.style.display="inline"
                check_imoji_check.style.display="none"
                check_school_number.textContent = "존재하지 않는 학번입니다."
                game_start_button.style.display="none"
            }
        },
        ()=>{
            before_start_setting[0]=0
            check_imoji.style.display="inline"
            check_imoji_check.style.display="none"
            check_school_number.textContent = "다시 시도해주세요."
            game_start_button.style.display="none"
        })
        
        
    }else{
        user_School_Number = document.getElementById("school_number").value + ord(e.keyCode);
    }
}

function min(a,b){
    if(a>b)return b
    else return a
}
function max(a,b){
    if(a<b)return b
    else return a
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log_create(a,b){
    return "log_{"+(a)+"}{"+(b)+"}"
}

function sqrt_create(a,b){
    if(a==2){
        return "\\sqrt{"+(b)+"}"
    }else{
        return "\\sqrt["+(a)+"]{"+(b)+"}"
    }
}

function linear_func_create(a,b){
    if(a==0){
        if(b<0){
            return "-"+(-b)
        }else{
            return (b)
        }
    }
    if(a==1){
        if(b<0){
            return "x-"+(-b)
        }else if (b>0){
            return "x+"+(b)
        }else{
            return "x"
        }
    }
    if(a==-1){
        if(b<0){
            return "-x-"+(-b)
        }else if(b>0){
            return "-x+"+(b)
        }else{
            return "-x"
        }
    }
    if(b<0){
        return (a)+"x-"+(-b)
    }else if(b>0){
        return (a)+"x+"+(b)
    }else{
        return (a)+"x"
    }
}

function new_pb(){

    /*
    수열 문제 유형
    1. 빈칸 o 3점
    2. 공차 구하기 o 3점
    3. n번째 항 구하기  5점      n번째 항 : an, 1번째 항 : a1

    지수함수

    로그함수
    
    
    */
    let problem="";
    let rdm=0;

    if(category==="수열"){
        let a_1 = rand(2,17)
        let number_cnt=rand(3,6)
        rdm=rand(1,3)
        /*
        let record_style={
            "category":"",
            "problem":"",
            "problem_answer":0,
            "user_answers":""
        }
        */
        if(rdm==1){
            /*공차 or 공비 구하기 */
            if(rand(1,2)==1){
                /*등비 */
                let r=rand(2,5)
                if(rand(1,2)==1)r*=-1
                for(var i=0;i<number_cnt;i++){
                    
                    if(number_cnt>=3 && i==parseInt(number_cnt/2))problem+= "\\\\ "
                    problem+="a_"+(i+1)+" = "+(a_1*pow(r,i))+", "
                }
                problem+="r = ?"
                record_style["category"]="공비 구하기"
                answer=r
                
            }else{
                /*등차 */
                let d=rand(1,5)
                if(rand(1,2)==1)d*=-1
                for(var i=0;i<number_cnt;i++){
                    if(number_cnt>=3 && i==parseInt(number_cnt/2))problem+= "\\\\ "
                    problem+="a_"+(i+1)+" = "+(a_1+d*i)+", "
                }
                problem+="d = ?"
                record_style["category"]="공차 구하기"
                answer=d
            }
            problem_score=[1,-1] // 맞추면 1점, 틀리면 1점

        }else if(rdm==2){
            /*빈칸 */
            let idx=rand(0,number_cnt-1)
            if(rand(1,2)==1){
                /*등비 */
                let r=rand(2,5)
                if(rand(1,2)==1)r*=-1
                for(var i=0;i<number_cnt;i++){
                    if(number_cnt>=3 && i==parseInt(number_cnt/2))problem+= "\\\\ "
                    if(i===idx){
                        problem+="a_"+(idx+1)+" = ?"
                    }else{
                        problem+="a_"+(i+1)+" = "+(a_1*pow(r,i))+", " 
                    }
                }
 
                record_style["category"]="빈칸 구하기(등비)"
                answer=a_1*(r**idx)
            }else{
                /*등차 */
                let d=rand(1,5)
                if(rand(1,2)==1)d*=-1
                for(var i=0;i<number_cnt;i++){
                    if(number_cnt>=3 && i==parseInt(number_cnt/2))problem+= "\\\\ "
                    if(i===idx){
                        problem+="a_"+(idx+1)+" = ?"
                    }else{
                        problem+="a_"+(i+1)+" = "+(a_1+d*i)+", "
                    }
                }

                record_style["category"]="빈칸 구하기(등차)"
                answer=a_1+d*idx
            }
            problem_score=[3,-2]

        }else{
            /*n번째 항 */
            let N=rand(number_cnt+3,number_cnt+20)
            /*등차 */
            let d=rand(1,5)
            if(rand(1,2)==1)d*=-1
            let first_a = rand(1,number_cnt-1)
            let second_a = rand(first_a+1,number_cnt)
            problem = "a_"+(first_a)+" = "+(a_1+d*(first_a-1))+", "+"a_"+(second_a)+" = "+(a_1+d*(second_a-1))+", "+"a_{"+(N)+ "} = ?"
            record_style["category"]="n번째 값 구하기"
            answer=a_1+d*(N-1)
            problem_score=[5,-2]
            
        }
    }else if(category=="로그"){
        //"log_a{b}"
        /*
        1. 로그 값 맞추기
        2. 로그 함수(b부분에 방정식 넣기)
        3. 값나타내고 로그안의 ? 맞추기
        */
        /*
        let record_style={
            "category":"",
            "problem":"",
            "problem_answer":0,
            "user_answers":""
        }
        */
        rdm=rand(1,3)
        
        if(rdm==1){
            let a = rand(2,5)
            let k = rand(0,5)
            problem=log_create(a,pow(a,k))+" = ?"
            record_style["category"]="로그 값 맞추기"
            answer=k
            problem_score=[1,-1]
        }else if(rdm==2){
            let a= rand(2,5)
            let k = rand(0,3)
            let value = rand(1,3)
            let B = rand(-3,3)
            if(value==1){
                // 밑이 1차함수
                if(B<0){
                    problem=log_create("x-"+(-B),pow(a,k))+" = "+(k)
                }else{
                    problem=log_create("x+"+B,pow(a,k))+" = "+(k)
                }
                answer=a-B
                problem_score=[3,-2]
            }else if(value==2){
                // 지수가 1차함수
                if(B<0){
                    problem=log_create(a,pow(a,k))+" = "+"x-"+(-B)
                }else{
                    problem=log_create(a,pow(a,k))+" = "+"x+"+(B)
                }
                answer=k-B
                problem_score=[3,-2]
            }else if(value==3){
                // 진수가 1차함수
                if(B<0){
                    problem=log_create(a,"x-"+(-B))+" = "+ (k)
                }else{
                    problem=log_create(a,"x+"+B)+" = "+ (k)
                }
                answer=pow(a,k)-B
                problem_score=[5,-2]
            }
            problem+="\\\\ x = ?"
            record_style["category"]="로그 함수의 x 맞추기"

        }else if(rdm==3){
            let a= rand(2,5)
            let k = rand(0,4)
            if(rand(1,2)==1){
                problem=log_create("?",pow(a,k))+" = "+(k)
                answer=a
            }else{
                problem=log_create(a,"?")+ " = "+ (k)
                answer=pow(a,k)
            }
            record_style["category"]="로그 안의 값 맞추기"
            problem_score=[2,-2]
        }
        

    }else if(category=="지수"){
         //"log_a{b}"
        /*
        1. 루트 풀기(제곱근)
        2. 지수 함수 값 맞추기
        3. 두 지수 함수 비교
        */
        /*
        let record_style={
            "category":"",
            "problem":"",
            "problem_answer":0,
            "user_answers":""
        }
        record_style["category"]="로그 안의 값 맞추기"
        */
        let rdm=rand(1,3)
        problem=""
        if(rdm==1){
            let root=rand(1,3)
            let a = rand(1,3)
            let answer_value=rand(1,3)
            let root_value=0
            let a_value=1
            let stack=[]
            for(var idx=0;idx<root;idx++){
                root_value=rand(2,4)
                stack.push(root_value)
                a_value*=root_value
            }
            let last_value="{"+(a)+"}^{"+(a_value*answer_value)+"}"
            for(var idx=0;idx<root;idx++){
                last_value=sqrt_create(stack[idx],last_value)
            }
            problem=last_value+" = ?"
            answer=pow(a,answer_value)
            record_style["category"]="제곱근 계산"
            problem_score=[5,-3]
            

        }else if(rdm==2){
            let a=rand(-5,5)
            let b=rand(0,5)
            if(a>0){
                problem="{"+(a)+"}^{"+(b)+"} = ?"
            }else{
                problem="{("+(a)+")}^{"+(b)+"} = ?"
            }
            record_style["category"]="지수 함수 값 계산하기"
            problem_score=[1,-1]
            answer=pow(a,b)

        }else if(rdm==3){
            let a = rand(2,5)
            let A = rand(-3,3)
            let B_1 = rand(-5,5)
            let B_2 = rand(-5,5)
            
            problem = "{"+a+"}^{"+(linear_func_create(A,B_1))+"} = {"+a+"}^{"+(linear_func_create(A+1,B_2))+"} \\\\ x = ?"
            answer=B_1-B_2
            record_style["category"]="식을 만족하는 x 값 찾기"
            problem_score=[3,-3]

        }
    }
    console.log(problem)
    record_style["problem"]=problem
    record_style["problem_answer"]=String(answer)
    katex.render(record_style["problem"], PB, { 
        throwOnError:false,
        strict: true
    });
    //console.log(katex)
    //PB.textContent = problem

}
function new_ans(i){
    let random=rand(1,percent[1])
    if(random<=percent[0]){
        /*answer*/
        last_percent[0]=percent[0]
        last_percent[1]=percent[1]
        last_percent[0]=min(last_percent[0],last_percent[1])
        percent[0]=1
        percent[1]++

        mole_ans[i]=answer
    }else{
        /*not answer*/
        let wrong_answer=0;
        if(rand(1,2)===1){
            wrong_answer=rand(answer-10,answer-1)
        }else{
            wrong_answer=rand(answer+1,answer+10)
        }
        mole_ans[i]=wrong_answer
        percent[0]++


    }

}


function game_start(){
    modal.style.display="none"
    gs.style.display="none"
    sp.style.display="none"
    gameover_show_re.style.display="none"
    score = 0
    answer = 0 
    game_finish = 0
    percent[0]=1
    percent[1]=holes.length
    last_percent[0]=1
    last_percent[1]=holes.length

    game_record = []
    record_style={
        "category":"",
        "problem":"",
        "problem_answer":"",
        "user_answers":""
    }

    new_pb()
    for(var i=0;i<holes.length;i++){
        hole_out[i]=0
        if(last_game===0){
            const hole = holes[i]
            const img = document.createElement('img')
            img.classList.add('mole-down')
            img.src = './image/mole.png'
            img.id = 'mole-movement_'+i
            
            hole.appendChild(img)

            const span = document.createElement('span')
            let mole_text=document.createTextNode('')
            span.classList.add('text-down')
            span.appendChild(mole_text)
            span.id = 'text-movement_'+i

            hole.appendChild(span)
        }

        new_ans(i)
        mole_move('rise','down',i)



    }
    start_time = new Date().getTime()
    last_game=1
    
    let timer_value=0;
    TIMER.textContent = game_play_time
    timer_value= setInterval(()=>{
        TIMER.textContent = (game_play_time-((new Date().getTime() - start_time)/1000)).toFixed(2)
        if(TIMER.textContent<=0){
            if(game_finish===0){
                game_finish = 1
                console.log('Game Finish!!')
                game_record.push(record_style)
                console.log(game_record)
                TIMER.textContent=0.00

                /*
                
                {
                    "main_category": "",
                    "correct_pb_cnt": 4440,
                    "wrong_pb_cnt": 3330,
                    "score": 144231330,
                    "user_name": "",
                    "create_date": datetime.now(),
                    "detail": [
                        {
                        "category": "1112222",
                        "problem": "33334444",
                        "problem_answer": "qqqqqwwww",
                        "user_answers": "ddddzzzxss"
                        }
                    ]
                }
                
                */

                params = JSON.stringify({
                    "main_category": category,
                    "correct_pb_cnt": correct_pb_cnt,
                    "wrong_pb_cnt": wrong_pb_cnt,
                    "score": score,
                    "detail": game_record
                });
                
                fastapi('post',domain+"/api/record/create/"+String(user_School_Number), params)

            }else{
                clearTimeout(timer_value)
                modal.style.display = ""
                gs.style.display = "none"
                sp.style.display = "none"
                gameover_show_re.style.display = "inline"
                final_score.textContent=score
            }
        }
    },1)
    for(var i=0;i<holes.length;i++){
        if(hole_out[i]===0)run(i)

    }

    
}

function retry_game(){
    modal.style.display = ""
    gs.style.display = "none"
    sp.style.display = "inline"
    gameover_show_re.style.display = "none"

}

function mole_move(A,B,i){ /* class : A -> B, down : {A:mole-rise,B:mole-down}, up : {A:mole-down,B:mole-rise} */
    const mole_before_class = "mole-"+A
    const mole_after_class = "mole-"+B

    const text_before_class = "text-"+A
    const text_after_class = "text-"+B

    const before_class = document.getElementById("mole-movement_"+i)
    before_class.classList.replace(mole_before_class,mole_after_class)

    const before_class_text = document.getElementById("text-movement_"+i)
    before_class_text.classList.replace(text_before_class,text_after_class)


}
function update_percent(new_answer){
    percent[0]=1
    percent[1]=holes.length
    last_percent=[1,holes.length]
    for(var i=0;i<holes.length;i++){
        if(mole_ans[i]==new_answer){
            last_percent[0]=percent[0]
            last_percent[1]=percent[1]
            last_percent[0]=min(last_percent[0],last_percent[1])
            percent[0]=1
            percent[1]++
        }else{
            percent[0]++
        }
    }
    return percent
}


function run(i){
    const hole = holes[i]
    let timer = null
    let uptimer = null

    if(TIMER.textContent<=0){
        clearTimeout(uptimer)
        return
    }

    uptimer = setTimeout(() => { /* 두더지가 올라오기전 대기 시간 */
        const img = document.getElementById('mole-movement_'+i)
        const span = document.getElementById('text-movement_'+i)

        if(TIMER.textContent<=0){
            clearTimeout(uptimer)
            return
        }
        
        /* 변경 */
        span.innerHTML = mole_ans[i];
        mole_move('down','rise',i)
        hole_out[i]=1

        img.addEventListener('click', () => { /* 두더지를 때렸을 때*/
            if(hole_out[i]===1){
                hole_out[i]=0
                console.log(mole_ans[i],answer,mole_ans[i]==answer,mole_ans[i]===answer)
                if(mole_ans[i]===answer){
                    score += problem_score[0]
                    correct_pb_cnt++
                    record_style["user_answers"]+=String(mole_ans[i])
                    game_record.push(record_style)
                    correct.play()
                    record_style={
                        "category":"",
                        "problem":"",
                        "problem_answer":"",
                        "user_answers":""
                    }
                    new_pb()
                    update_percent(answer)
                }else {
                    score += problem_score[1]
                    wrong_pb_cnt++
                    record_style["user_answers"]+=String(mole_ans[i])+","
                }
                scoreEl.textContent = score
                clearTimeout(timer)
                mole_move('rise','down',i)

                new_ans(i)

                run(i)
                return

            }
        })

        hole.appendChild(img)
        hole.appendChild(span)

        if(TIMER.textContent<=0){
            clearTimeout(timer)
            return
        }

        timer = setTimeout  (() => { /* 두더지를 때리지 못하고 들어갔을때 */
            hole_out[i]=0
            mole_move('rise','down',i)

            if(TIMER.textContent<=0){
                clearTimeout(timer)
                return
            }

            new_ans(i)
            run(i)
        }, rand(2000,3000))

    }, rand(1000,5000))

}

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY  - cursor.clientHeight/2 + 'px'
    cursor.style.left = e.pageX - cursor.clientWidth/2 + 'px'


})


window.addEventListener('mousedown', () => {
    audio.play()
    audio.volume = 0.5
    cursor.classList.add('active')
})
window.addEventListener('mouseup', () => {
    cursor.classList.remove('active')
    
})

window.addEventListener('touchstart', (e) => {
    audio.play()
    audio.volume = 0.5
    this.touches = e.changedTouches
    cursor.style.top = this.touches[0].pageY  - cursor.clientHeight/2 + 'px'
    cursor.style.left = this.touches[0].pageX - cursor.clientWidth/2 + 'px'
    cursor.classList.add('active-touch')
})
window.addEventListener('touchend', (e) => {
    this.touches = e.changedTouches
    cursor.style.top = this.touches[0].pageY  - cursor.clientHeight/2 + 'px'
    cursor.style.left = this.touches[0].pageX - cursor.clientWidth/2 + 'px'
    cursor.classList.remove('active-touch')
    
})