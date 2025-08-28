const url = new URL(window.location.href)


// 모달 있을 때 코드 들
// const modal = document.getElementById("modal")
// const gameover_show_re = document.getElementById("gameover")
// const gs = document.getElementById("game-setting")
// const submit_category = document.getElementById("submit-category")
// const submit_category_check = document.getElementById("submit-category_check")
// const check_school_number=document.querySelectorAll('.content span')[2]
// const sp = document.getElementById("start-page")
// const check_imoji = document.getElementById("submit-schoolnumber")
// const check_imoji_check = document.getElementById("submit-schoolnumber_check")
// const check_category=document.querySelectorAll('.content span')[5]


const cursor = document.querySelector('.cursor')
const holes = [...document.querySelectorAll('.mole')]
const hole_out = new Array(holes.length).fill(0)
const mole_ans = new Array(holes.length).fill(0)
const scoreEl = document.querySelector('.score span')
const final_score = document.querySelector('.final-score span')
const TIMER=document.querySelector('.timer span')
const PB=document.getElementById('problem')
const game_start_button = document.getElementById("start-img-button")
const isTouchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);

const intro_ui = document.getElementById("intro_ui")
const fin_ui = document.getElementById("fin_ui")
const FEVERTIME = document.getElementById('fever')

const startB = document.getElementById('startButton')
const stopB = document.getElementById('stopButton')

let fever = 0
let score = 0
let answer = 0 
let mole_condition = new Array(holes.length).fill('')
let percent=[1,holes.length]
let last_percent=[1,holes.length]
let user_School_Number = 0
let game_mode = 0
let start_time = 0
let game_finish = 0
let last_game = 0
let category = 0
let school_name = ""
// let category_list = ["로그","지수","수열"]
// let before_start_setting = [0,0] // 학번 입력, 게임 유형 선택
let game_play_time = 60
let problem_score=[0,0]
let game_record = []
let params={}
let pb_wrong_ans=0
let pb_wrong_answer_tiems=3
let user_info_ready = 0
let fever_value=0;
let record_style={
    "category":"",
    "problem":"",
    "problem_answer":"",
    "user_answers":""
}
let correct_pb_cnt = 0
let wrong_pb_cnt = 0

let audio = new Audio('./audio/atteck.mp3');
audio.volume = 0.5;
let correct = new Audio('./audio/correct.mp3');

let problem_list = []


const domain = "http://127.0.0.1:8000" //"http://127.0.0.1:8000"//https://mathgame.bass9030.dev//

function abs(a){
    if(a<0)return -a
    else return a
}

function pow(a,b){
    return Math.pow(a,b)
}
const new_mole = (i,succes_callback,failure_callback) => {
    const hole = holes[i]
    hole.querySelectorAll('*').forEach(n => n.remove());

    //const img = document.replaceChildren('img')
    const img = document.createElement('img')
    img.classList.add('mole-down-start')
    img.src = './image/mole.png'
    img.id = 'mole-movement_'+i

    hole.appendChild(img)

    //const span = document.replaceChildren('span')
    const span = document.createElement('span')
    let mole_text=document.createTextNode('')
    span.classList.add('text-down-start')
    span.appendChild(mole_text)
    span.id = 'text-movement_'+i

    hole.appendChild(span)

    succes_callback()
}


function fastapi(method,url, params){
    
    if(method=='post'){
        var xhr = new XMLHttpRequest();

        let pa={"school_name":school_name}

        url += "?" + new URLSearchParams(pa)

        xhr.open("POST", url, true);

        // Set headers
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Request was successful
                //console.log(xhr.responseText);
            } else {
                // Handle errors or other status codes here
                //console.error(xhr.statusText);
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
                //console.log('통신 성공!');
                //console.log(xhr.responseText,JSON.parse(xhr.responseText).user_exit);
                //console.log(JSON.parse(xhr.responseText).user_exit==true)
            } else {
                console.error('통신 실패!');
            }
        }
        };

        xhr.send();
    }
}
const user_available_check = (url,params,succes_callback,failure_callback) => {
    const xhr = new XMLHttpRequest();

    url += "?" + new URLSearchParams(params)

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
// 모달 창 있을 때 코드
// function setting_game(){
//     // //gs.style.display = "inline"
//     // //sp.style.display = "none"
//     // check_imoji.style.display="none"
//     // check_imoji_check.style.display="none"
//     // submit_category.style.display="none"
//     // submit_category_check.style.display="none"
//     // check_category.textContent=""
//     // game_start_button.style.display="none"

//     /* 수정 후 코드 */

//     intro_ui.style.display="none"

//     before_start_setting=[0,0]

// }


// function click2start(){
//     params={"school_name" : "운호고등학교"}
//     user_available_check(domain+'/api/user/user-exist/'+String(user_School_Number),params,(json)=>{
//         if(json.user_exit){
//             check_imoji.style.display="inline"
//             check_imoji_check.style.display="inline"
//             check_school_number.textContent = "학번 :"+user_School_Number
//             before_start_setting[0]=1
//             if(before_start_setting[0]==1 && before_start_setting[1]==1){
//                 game_start_button.style.display="inline"
//             }
//         }else{
//             before_start_setting[0]=0
//             check_imoji.style.display="inline"
//             check_imoji_check.style.display="none"
//             check_school_number.textContent = "존재하지 않는 학번입니다."
//             game_start_button.style.display="none"
//         }
//     },
//     ()=>{
//         before_start_setting[0]=0
//         check_imoji.style.display="inline"
//         check_imoji_check.style.display="none"
//         check_school_number.textContent = "다시 시도해주세요."
//         game_start_button.style.display="none"
//     })

// }
// function set_category(input_category){
//     if(category_list.includes(String(input_category))){
//         category=input_category
//         submit_category.style.display="inline"
//         submit_category_check.style.display="inline"
//         check_category.textContent = "유형 : " + category
//         before_start_setting[1]=1
//         if(before_start_setting[0]==1 && before_start_setting[1]==1){
//             game_start_button.style.display="inline"
//         }
//     }else{
//         alert('올바르지 않은 카테고리')
//     }

// }

// function school_number(e){ // value + ord(keyCode) : 입력한 숫자
//     if(e.keyCode === 13){ //13 이 엔터 입력
//         params={"school_name" : "운호고등학교"}
//         user_available_check(domain+'/api/user/user-exist/'+String(user_School_Number),params,(json)=>{
//             if(json.user_exit){
//                 check_imoji.style.display="inline"
//                 check_imoji_check.style.display="inline"
//                 check_school_number.textContent = "학번 :"+user_School_Number
//                 before_start_setting[0]=1
//                 if(before_start_setting[0]==1 && before_start_setting[1]==1){
//                     game_start_button.style.display="inline"
//                 }
//             }else{
//                 before_start_setting[0]=0
//                 check_imoji.style.display="inline"
//                 check_imoji_check.style.display="none"
//                 check_school_number.textContent = "존재하지 않는 학번입니다."
//                 game_start_button.style.display="none"
//             }
//         },
//         ()=>{
//             before_start_setting[0]=0
//             check_imoji.style.display="inline"
//             check_imoji_check.style.display="none"
//             check_school_number.textContent = "다시 시도해주세요."
//             game_start_button.style.display="none"
//         })
        
        
//     }else{
//         user_School_Number = document.getElementById("school_number").value + ord(e.keyCode);
//     }
// }

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



/* $.ajax({

    type: "POST",
    url: "/sign_up/save",
    data: {},
    success: function (response) {
        if (response['result'] == 'success') {
            reAction(); //꽃가루   
        }
    }
});




function reAction() {
    $("#startButton").trigger("click");
    setTimeout(function () {
        $("#stopButton").trigger("click");
    }, 5000);
}

 */
/* 
function reAction() {
    $("#startButton").trigger("click");
    setTimeout(function () {
        $("#stopButton").trigger("click");
    }, 5000);
}
 */
function new_pb(pb_wrong_ans){

    // fever 관련 코드
    /* if(pb_wrong_ans==-2 || pb_wrong_ans==-1){
        FEVERTIME.value='0';
    }else{
        fever_value = (parseInt(FEVERTIME.value,10) + (3-pb_wrong_ans));
        FEVERTIME.value = fever_value.toString();
        if(fever_value>=3){
            console.log('!@#!@#!@#')
            reAction();
        }
    } */

    /*
    수열 문제 유형
    1. 빈칸 o 3점
    2. 공차 구하기 o 3점
    3. n번째 항 구하기  5점      n번째 항 : an, 1번째 항 : a1

    지수함수

    로그함수
    
    
    */
   let check = 0

    if(problem_list.length<10){
        //console.log('!!!')
        //add_problem_list() // 비동기 과정 때문에 값이 없을 때 밑에 코드가 실행됨 -> 0 일때는 추가될때까지 기다렸다가 가야 될듯
        params={
            "school_name" : school_name,
            "cnt" : 10,
            "school_number" : user_School_Number,
            "category" : category
        }
        // emit 에서 카테고리 추가해야됨
        user_available_check(domain+'/api/problem/problem-emit',params,(json)=>{
            
            //console.log("problem_list ",json.problem_list)
            for(const one_problem in json.problem_list){
                //console.log("one_problem ",one_problem)
                problem_list.push(json.problem_list[one_problem])

            }
            if(check==0){
                pb_create()
            }
        },
        ()=>{
        })
        if(problem_list.length!=0){
            check = 1
            pb_create()
        }
    }else{
        pb_create()
    }

}
function pb_create(){

    let problem=""
    let rdm=0

    //console.log('--!-----!--')
    //console.log(problem_list)

    if(problem_list[0].problem_level!=5){ // ==4
        

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
                let a = rand(2,4)
                let k = rand(0,4)
                problem=log_create(a,pow(a,k))+" = ?"
                record_style["category"]="로그 값 맞추기"
                answer=k
                problem_score=[1,-1]
            }else if(rdm==2){
                let a= rand(2,4)
                let k = rand(1,4)
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
                        problem=log_create(a,"("+"x-"+(-B)+")")+" = "+ (k)
                    }else{
                        if(B==0){
                            problem=log_create(a,"x")+" = "+ (k)
                        }else{
                            problem=log_create(a,"("+"x+"+(B)+")")+" = "+ (k)
                        }
                    }
                    answer=pow(a,k)-B
                    problem_score=[5,-2]
                }
                problem+="\\\\ x = ?"
                record_style["category"]="로그 함수의 x 맞추기"
    
            }else if(rdm==3){
                let a= rand(2,4)
                if(rand(1,2)==1){
                    let k = rand(1,4)
                    problem=log_create("?",pow(a,k))+" = "+(k)
                    answer=a
                }else{
                    let k = rand(0,3)
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
            rdm=rand(1,3)
            problem=""
            if(rdm==1){
                let root=rand(1,3)
                let a = rand(1,3)
                let answer_value=rand(1,3)
                let root_value=0
                let a_value=1
                let stack=[]
                for(var idx=0;idx<root;idx++){
                    root_value=rand(2,3)
                    if(a_value*root_value>20){
                        root=idx
                        break
                    }else{
                        stack.push(root_value)
                        a_value*=root_value
                    }
                }
                let last_value="{"+(a)+"}^{"+(a_value*answer_value)+"}"
                for(var idx=0;idx<root;idx++){
                    last_value=sqrt_create(stack[idx],last_value)
                }
                problem=last_value+" = ?"
                answer=pow(a,answer_value)
                record_style["category"]="제곱근 계산"
                problem_score=[5,-2]
                
    
            }else if(rdm==2){
                let a=rand(-4,4)
                let b=rand(0,4)
                if(a==0 && b==0){
                    b=1
                }
                if(a>0){
                    problem="{"+(a)+"}^{"+(b)+"} = ?"
                }else{
                    problem="{("+(a)+")}^{"+(b)+"} = ?"
                }
                record_style["category"]="지수 함수 값 계산하기"
                
                answer=pow(a,b)
                if(abs(answer)<=10){
                    problem_score=[1,-1]
                }else if(abs(answer)<=30){
                    problem_score=[2,-2]
                }else if(abs(answer)<=100){
                    problem_score=[2,-1]
                }else{
                    problem_score=[3,-2]
                }
    
            }else if(rdm==3){
                let a = rand(2,4)
                let A = rand(-3,3)
                let B_1 = rand(-3,4)
                let B_2 = rand(-3,4)
                
                problem = "{"+a+"}^{"+(linear_func_create(A,B_1))+"} = {"+a+"}^{"+(linear_func_create(A+1,B_2))+"} \\\\ x = ?"
                answer=B_1-B_2
                record_style["category"]="식을 만족하는 x 값 찾기"
                problem_score=[4,-2]
    
            }
        }else if(category=="극한"){
            //console.log('!!!!!!!')
            // http://127.0.0.1:5501/?token=20402&type=%EA%B7%B9%ED%95%9C&school=%EC%9A%B4%ED%98%B8%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90

            // https://namu.wiki/w/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4:%EB%AC%B8%EB%B2%95%20%EB%8F%84%EC%9B%80%EB%A7%90/%EC%8B%AC%ED%99%94/TeX

            rdm=rand(1,4)
            problem=""

            if(rdm==1){ // 1. 정수로 갈때 극한 값 찾기(1,2차, 유리함수는 보류) (명칭 : 극한값 찾기(정수))
                // lim(x->k) ax+b = ? 형태
                // 1차,2차,유리함수 다 형태를 다르게 해야되서 다 다른 문제로 나눠야됨
                // 일단 1차만

                // 수정중

                // "io/?token={$school_number}&type={category_name}&school={$school_name}"

                //console.log('$$')
                let k = rand(-4,4)
                let a = rand(-4,4)
                let b = rand(-4,4)

                // \lim_{x \to 2} (ax+b)
                // "\\lim\\limits_{x \\to 2}"

                problem="\\lim\\limits_{x \\to "+(k)+"} ("+linear_func_create(a,b)+") = {?}"
                //console.log(problem)
                answer=a*k+b
                record_style["category"]="극한값 찾기(정수)"
                problem_score=[2,-1]
                
    
            }else if(rdm==2){


                // https://katex.org/
                //console.log('ADSF!@#!@#')
                // 극한 값 찾기 (inf)
                //  lim(x->inf) ((ax+b)/(cx+d)) = ?

                // 수정중

                // "io/?token={$school_number}&type={category_name}&school={$school_name}"

                //console.log('$$')
                let k = rand(-4,4)
                let c = 0
                if(rand(1,2)==1){
                    c =rand(1,5)
                }else{
                    c = rand(-5,-1)
                }

                let b = rand(-4,4)
                let d = rand(-4,4)
                let alpha = rand(-7,7)

                // \lim_{x \to 2} (ax+b)
                // "\\lim\\limits_{x \\to 2}"

                problem="\\lim\\limits_{x \\to \\infty} {"+linear_func_create(alpha*c,b)+" \\over "+linear_func_create(c,d)+"} = {?}"
                //console.log(problem)
                answer=alpha
                record_style["category"]="극한 값 찾기(inf)"
                problem_score=[2,-1]

            }else if(rdm==3){
                // 조건 나눠서 미지수 찾기,
                // - ax+b (x>e) , cx+d (x<=e) || ax^2+bx+c (x>d) , e (x<=d) 의 형태

                let e = rand(-5,5)
                let ran=rand(3,3)
                if(ran==1 || ran==3){
                    // a
                    // a = (ce+d-b)/e
                    // e*alpha = d-b, b = d - e*alpha
                    if(e==0)e=e+1
                    let alpha = rand(-3,3)
                    let d = rand(-3,3)
                    let b = d - e*alpha
                    let c = rand(-3,3)
                    answer = c + alpha

                    if(ran==1){
                        problem="{\\begin{cases}"+ "k" +linear_func_create(1,b) + " & (x<"+e+") \\\\ " +linear_func_create(c,d) +" & (x>="+e+") \\end{cases}} \\quad  k = {?}  \\\\ \\text{(x="+e+" 에서 수렴)}"

                    }else{
                        problem="{\\begin{cases}" + linear_func_create(c,d) + " & (x<"+e+") \\\\ " + "k" +linear_func_create(1,b) +" & (x>="+e+") \\end{cases}} \\quad  k = {?}  \\\\ \\text{(x="+e+" 에서 수렴)}"
                    }
        

                }else if(ran==2){
                    // b
                    let a = rand(-3,3)
                    let c = rand(-3,3)
                    let d = rand(-3,3)
                    answer = c*e+d-a*e

                    problem="{\\begin{cases}"+ linear_func_create(a,0)+' + k' + " & (x<"+e+") \\\\ " +linear_func_create(c,d) +" & (x>="+e+") \\end{cases}} \\quad  k = {?}  \\\\ \\text{(x="+e+" 에서 수렴)}"

                }else if(ran==4){
                    // d
                    let a = rand(-3,3)
                    let c = rand(-3,3)
                    let b = rand(-3,3)
                    answer = a*e+b-c*e
                    problem="{\\begin{cases}"+ linear_func_create(a,b) + " & (x<"+e+") \\\\ " +linear_func_create(c,0)+' + k' +" & (x>="+e+") \\end{cases}} \\quad  k = {?} \\\\ \\text{(x="+e+" 에서 수렴)}"

                }

                // \lim_{x \to 2} (ax+b)
                // "\\lim\\limits_{x \\to 2}"

                //console.log(problem)
                record_style["category"]="조건 나눠서 미지수 찾기"
                problem_score=[5,-2]
    
            }else if(rdm==4){
                // 샌드위치
                //console.log('new!!')
                let ran=(1,1)
                let ans = rand(-25,25)
                if(ran==1){
                    // ->a
                    let k = rand(-4,4)
                    if(k==0){
                        k+=rand(1,3)
                    }
                    alpha = Math.floor(ans/k)
                    let a=[alpha+rand(-2,2),alpha+rand(-2,2)]
                    let b=[ans-a[0]*k,ans-a[1]*k]


                    //linear_func_create(a[0],b[0]) + "< f(x) < " + linear_func_create(a[1],b[1]) + "\; \\lim\\limits_{x \\to "+(k)+"} = {?}"
                    problem=linear_func_create(a[0],b[0]) + "< f(x) < " + linear_func_create(a[1],b[1]) + "\\\\ \\lim\\limits_{x \\to "+(k)+"} f(x) = {?}"

                    record_style["category"]="샌드위치 정리(a)"


                }else if(ran==2){
                    // -> infi

                    record_style["category"]="샌드위치 정리(inf)"

                }


                answer=ans

                problem_score=[3,-2]

            }else if(rdm==5){
                // 사칙 연산
            }else if(rdm==6){
                // 인수분해
            }
        }else if(category=="연속"){
            // http://127.0.0.1:5501/?token=20402&type=%EA%B7%B9%ED%95%9C&school=%EC%9A%B4%ED%98%B8%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90
            rdm=rand(1,3)
            problem=""

            if(rdm==1){
                // lim = f(a)

                let e = rand(-5,5)

                let a = rand(-3,3)
                let c = rand(-3,3)
                let d = rand(-3,3)
                let k = c*e+d-a*e
                answer = c*e+d

                problem="{\\begin{cases}"+ linear_func_create(a,k)+ " & (x<"+e+") \\\\ " +linear_func_create(c,d) +" & (x>"+e+") \\end{cases}} \\lim\\limits_{x \\to "+e+"} {f(x)} = {f("+e+")} \\\\  {f("+e+")} = {?}"
                
                record_style["category"]="극한 = 함숫값"
                problem_score=[2,-1]
                
            }else if(rdm==2){
                // lim = k, f(x) = ax^n ~ , f(a) = ?
                let ran=rand(1,1)
                if(ran==1){
                    let k = rand(-20,20)
                    answer=k
                    let fn = ""
                    let n = rand(2,5)
                    for(let i = 0;i<=n;i++){

                        fn=fn+String.fromCharCode(97+i)
                        if(i!=n){
                            if(n-i==1){
                                fn=fn+"x"
                            }else{
                                fn=fn+"x^"+(n-i)
                            }
                            fn = fn+"+"
                        }
                
                    }
                    let xto=rand(-100,100)
                    problem = "\\lim\\limits_{x \\to "+xto+"}" + "{f(x)} = " + k + ", \\\\ {f(x)} = " + fn + ", \\; {f("+xto+")} = {?}"
                    problem_score=[1,-1]
                    record_style["category"]="다항함수에서 함숫값 찾기"


                }
            }else if(rdm==4){
                // f(x+p)=f(x)
            }else if(rdm==3){
                // mx, mn
                ran=rand(1,1)
                
                if(ran==1){
                    // right
                    let left = rand(-2,2)
                    let right = rand(left+1,left+3)
                    let a = rand(-4,4)
                    let b = rand(-4,4)
                    let mx=max(a*left+b,a*right+b)
                    let mn=min(a*left+b,a*right+b)

                    let rnd=rand(1,2)
                    problem = "["+left+","+right+"], \\; y = "+linear_func_create(a,b)+", \\; "
                    problem_score=[2,-1]
                    if(rnd==1){
                        //max
                        problem = problem + "\\text{최댓값} = {?}"
                        answer=mx
                    }else{
                        // min
                        problem = problem + "\\text{최솟값} = {?}"
                        answer=mn
                    }
                    record_style["category"]="다항함수의 최대 최소"

                }else{
                    // left
                }

                
            }

        }else if(category=="미분"){
            // http://127.0.0.1:5501/?token=20402&type=%EA%B7%B9%ED%95%9C&school=%EC%9A%B4%ED%98%B8%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90
            rdm=rand(1,4)
            problem=""
            if(rdm==1){
                // f(x) 미분
                
                let fn=""
                let a=rand(-4,4)
                if(a==0){
                    a=a+1
                }
                let b=rand(-4,4)
                let c=rand(-4,4)
                let x=rand(-5,5)
                if(a==1){
                    fn="x^2"
                }else if(a==-1){
                    fn="-x^2"
                }else{
                    fn=a.toString()+"x^2"
                }
                if(b<0){
                    if(b==-1){
                        fn+=" -x"
                    }else{
                        fn+=" - " + (-b) + "x"
                    }
                }else if(b>0){
                    if(b==1){
                        fn+=" + x"

                    }else{
                        fn+=" + " + b + "x"
                    }
                }
                if(c<0){
                    fn+=" - " + (-c)
                }else if(c>0){
                    fn+=" + " + c
                }

                answer = 2*a*x+b

                problem = "{f(x)} = "+fn + "\\\\ f^\\prime ("+x+") = {?}"

                problem_score=[2,-1]
                record_style["category"]="함수 미분값 구하기"


            }else if(rdm==2){
                // 순간 변화율(일반식)

                let fprime = rand(-5,5)
                let a = rand(-10,10)
                let b = rand(-10,10)
                answer = (a-b)*fprime

                let fn = "\\lim\\limits_{h \\to 0} \\frac {f(x"
                if(a==1){
                    fn+="+h)-f(x"
                }else if(a==-1){
                    fn+="-h)-f(x"
                }else{
                    if(a>0){
                        fn+="+"+a.toString()+"h)-f(x"
                    }else if(a<0){
                        fn+="-"+(-a).toString()+"h)-f(x"
                    }else{
                        fn+=")-f(x"
                    }
                }
                if(b==1){
                    fn+="+h)} {h}"
                }else if(b==-1){
                    fn+="-h)} {h}"
                }else{
                    if(b>0){
                        fn+="+"+b.toString()+"h)} {h}"
                    }else if(b<0){
                        fn+="-"+(-b).toString()+"h)} {h}"
                    }else{
                        fn+=")} {h}"
                    }
                }
                //+"h)-f(x)} {h} = f^\\prime (x)"

                problem = "f^\\prime (x) = "+fprime + "\\quad"+fn+" = {?}"+"\\\\ \\text{f(x)는 미분 가능 함수} "

                problem_score=[2,-1]
                record_style["category"]="순간변화율(일반식)"


            }else if(rdm==3){
                // 순간변화율 변형(h무한)
                let fprime = rand(-5,5)
                let a = rand(-10,10)
                let b = rand(-10,10)
                answer = (a-b)*fprime

                let fn = "\\lim\\limits_{h \\to \\infty} h(f(x"
                if(a==1){
                    fn+="+\\frac{1}{h})-f(x"
                }else if(a==-1){
                    fn+="-\\frac{1}{h})-f(x"
                }else{
                    if(a>0){
                        fn+="+"+"\\frac{"+a.toString()+"}{h})-f(x"
                    }else if(a<0){
                        fn+="-"+"\\frac{"+(-a).toString()+"}{h})-f(x"
                    }else{
                        fn+=")-f(x"
                    }
                }
                if(b==1){
                    fn+="+\\frac{1}{h}))"
                }else if(b==-1){
                    fn+="-\\frac{1}{h}))"
                }else{
                    if(b>0){
                        fn+="+"+"\\frac{"+b.toString()+"}{h}))"
                    }else if(b<0){
                        fn+="-"+"\\frac{"+(-b).toString()+"}{h}))"
                    }else{
                        fn+="))"
                    }
                }
                //+"h)-f(x)} {h} = f^\\prime (x)"

                problem = "f^\\prime (x) = "+fprime + " \\quad "+fn+" = {?}"+" \\\\ \\text{f(x)는 미분 가능 함수} "

                problem_score=[3,-1]
                record_style["category"]="순간변화율 변형(h무한)"
            }else if(rdm==4){
                // 일반 식 (f(x)-a)/(x-b) = c


                let a = rand(-5,5)
                let b = rand(-5,5)
                let fn=""
                if(a<0){
                    fn = "{f(x)}-"+(-a)
                }else if(a>0){
                    fn = "{f(x)}+"+(a)
                }else{
                    fn = "{f(x)}"
                }

                


                problem = "\\lim\\limits_{x \\to "+(-b)+"}\\frac{"+fn+"}{"+linear_func_create(1,b)+"} = "+b + " \\quad"
                
                let rdn=rand(1,5)
                if(rdn==1){
                    problem += " f^\\prime("+(-b)+") = {?}"
                    answer = b
                }else if(rdn==2){
                    problem += " f("+(-b)+") = {?}"
                    answer = -a
                }else if(rdn==3){
                    problem += " f^\\prime("+(-b)+")f("+(-b)+") = {?}"
                    answer = (-a)*b
                }else if(rdn==4){
                    problem += " f^\\prime("+(-b)+") + f("+(-b)+") = {?}"
                    answer = b+(-a)
                }else if(rdn==5){
                    problem += " f^\\prime("+(-b)+") - f("+(-b)+") = {?}"
                    answer = b-(-a)
                }

                problem += " \\\\ \\text{f(x)는 미분 가능 함수}"

                problem_score=[2,-1]
                record_style["category"]="일반 식 (f(x)-a)/(x-b) = c"


            }
        }

    }else{

        problem=problem_list[0].problem
        answer=problem_list[0].answer
        record_style["category"] = problem_list[0].category
        problem_score=[problem_list[0].problem_level*2 - 1,-problem_list[0].problem_level]

        //console.log('---@----@----')
        //console.log(record_style["problem"],record_style["problem_answer"])


    }

    //console.log('!@#!@#!@#')
    //console.log(problem,answer)
    record_style["problem"]=problem
    record_style["problem_answer"]=String(answer)

    katex.render(record_style["problem"], PB, { 
        throwOnError:false,
        strict: true
    });
    if(category=="극한"){
        if(rdm!=3){
            PB.style.fontSize="130%"
        }else{
            PB.style.fontSize="100%"
        }
    }else{
        PB.style.fontSize="110%"
    }
    //console.log(katex)
    //PB.textContent = problem

    problem_list.shift()
}




// function add_problem_list(){
//     if(problem_list.size<8){
//         params={
//             "school_name" : school_name,
//             "cnt" : 10,
//             "school_number" : user_School_Number
//         }
//         user_available_check(domain+'/api/problem/problem-emit',params,(json)=>{
//             problem_list.push(json.problem_list)
//         },
//         ()=>{
//         })

//     }
// }



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
            wrong_answer=rand(answer-4,answer-1)
        }else{
            wrong_answer=rand(answer+1,answer+4)
        }
        mole_ans[i]=wrong_answer
        percent[0]++


    }

}


function correct_new_ans(i,new_answer){
    let random=rand(1,9)
    if(random<=percent[0]){
        /*answer*/

        mole_ans[i]=answer
    }else{
        /*not answer*/
        let wrong_answer=0;
        if(rand(1,2)===1){
            wrong_answer=rand(answer-5,answer-1)
        }else{
            wrong_answer=rand(answer+1,answer+5)
        }
        mole_ans[i]=wrong_answer

    }
    update_percent(new_answer)

}


function pd_mole(i){
    new_mole(i,()=>{
        new_ans(i)
        mole_move('rise','down',i)
    },()=>{})
}

function game_start(){



    /* 게임 시작 버튼을 누르면 실행됨 */
    /* 수정 전 코드 */


    // modal.style.display="none"
    // gs.style.display="none"
    // sp.style.display="none"
    // gameover_show_re.style.display="none"

    //console.log('START!!!!!')
    //console.log(user_info_ready)

    if(!user_info_ready)return;


    /* 수정 후 코드 */

    //console.log('GAME START!!!')
    intro_ui.style.display="none"
    fin_ui.style.display="none"
    
    


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

    new_pb(-2)
    for(var i=0;i<holes.length;i++){
        hole_out[i]=0
        pd_mole(i)

    }
    start_time = new Date().getTime()
    last_game=1
    
    let timer_value=0;
    TIMER.textContent = game_play_time
    timer_value= setInterval(()=>{
        TIMER.textContent = (game_play_time-((new Date().getTime() - start_time)/1000)).toFixed(2)
        if(TIMER.textContent<=0){ // game over
            if(game_finish===0){// game over 즉시
                game_finish = 1
                //console.log('Game Finish!!')
                game_record.push(record_style)
                //console.log(game_record)
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
                //console.log(params)
                //console.log(game_record)
                
                fastapi('post',domain+"/api/record/create/"+String(user_School_Number), params)

            }else{ // game over 이후 정지
                clearTimeout(timer_value)
                fin_ui.style.display = "inline"
                // modal.style.display = ""
                // gs.style.display = "none"
                // sp.style.display = "none"
                // gameover_show_re.style.display = "inline"
                final_score.textContent=score
            }
        }
    },1)
    for(var i=0;i<holes.length;i++){
        if(hole_out[i]===0)run(i)

    }

    
}

function retry_game(){
    game_start()
    // modal.style.display = ""
    // gs.style.display = "none"
    // sp.style.display = "inline"
    // gameover_show_re.style.display = "none"

}

function mole_move(A,B,i){ /* class : A -> B, down : {A:mole-rise,B:mole-down}, up : {A:mole-down,B:mole-rise} */


    if(mole_condition[i]==B)return


    const mole_before_class = "mole-"+A
    const mole_after_class = "mole-"+B

    const text_before_class = "text-"+A
    const text_after_class = "text-"+B

    const before_class = document.getElementById("mole-movement_"+i)
    before_class.classList.replace(mole_before_class,mole_after_class)

    const before_class_text = document.getElementById("text-movement_"+i)
    before_class_text.classList.replace(text_before_class,text_after_class)


    mole_condition[i]=B


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
        if(hole_out[i]==0){
            mole_move('down-start','rise',i)
            hole_out[i]=1
        }

        img.addEventListener('click', () => { /* 두더지를 때렸을 때*/

            var correct_answer = 0
            if(hole_out[i]===1){
                hole_out[i]=0
                //console.log(mole_ans[i],answer,mole_ans[i]==answer,mole_ans[i]===answer)
                if(mole_ans[i]===answer){
                    score += problem_score[0]
                    pb_wrong_ans+=wrong_pb_cnt
                    correct_pb_cnt++
                    record_style["user_answers"]+="ac" // correct
                    game_record.push(record_style)
                    correct.play()
                    record_style={
                        "category":"",
                        "problem":"",
                        "problem_answer":"",
                        "user_answers":""
                    }
                    let imsi=pb_wrong_ans
                    pb_wrong_ans=0

                    new_pb(imsi)
                    update_percent(answer)
                    correct_answer=1
                }else {
                    score += problem_score[1]
                    wrong_pb_cnt++
                    record_style["user_answers"]+=String(mole_ans[i])+","
                    if(pb_wrong_ans>=pb_wrong_answer_tiems+1){
                        record_style["user_answers"]+="wa" // wrong
                        pb_wrong_ans+=wrong_pb_cnt
                        game_record.push(record_style)
                        record_style={
                            "category":"",
                            "problem":"",
                            "problem_answer":"",
                            "user_answers":""
                        }
                        pb_wrong_ans=0
                        new_pb(-1)
                        update_percent(answer)
                    }
                }
                scoreEl.textContent = score
                clearTimeout(timer)
                mole_move('rise','down',i)
                const move_finish = document.getElementById("mole-movement_"+i)

                move_finish.addEventListener('animationend', () => {

                    new_mole(i,()=>{
                        if(correct_answer==1){
                            correct_new_ans(i,answer)
                        }else{
                            new_ans(i)
                        }
                        run(i)
                        return
                    },()=>{})
                });

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
            const move_finish = document.getElementById("mole-movement_"+i)

            move_finish.addEventListener('animationend', () => {
                new_mole(i,()=>{
                    new_ans(i)
                    run(i)
                },()=>{})
            });

        }, rand(1800,2000))

    }, rand(1000,2000))

}

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY  - cursor.clientHeight/2 + 'px'
    cursor.style.left = e.pageX - cursor.clientWidth/2 + 'px'


})
// 휴대폰에서 누르면 1,2 도 반응함
// 0 : 컴퓨터, 1 : 휴대폰
if(!isTouchDevice){

    cursor.classList.add('mousepointer-on')

    window.addEventListener('mousedown', () => {
        //console.log('mousedown')
        audio.pause();
        audio.currentTime = 0;
        audio.play();

        cursor.classList.add('active')
    })
    window.addEventListener('mouseup', () => {

        cursor.classList.remove('active')
        
    })
    
}else{
    cursor.classList.add('mousepointer-off')
}
window.addEventListener('touchstart', (e) => {
    audio.pause();
    audio.currentTime = 0;
    audio.play()
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

window.addEventListener('load', () => {

    let c_token = hasParam('token') // 학번
    let c_type = hasParam('type') // 게임 종류
    let c_school_name = hasParam('school')
    // 앞에 있는거만 반응함, & 를 쓰면 둘다 작용


    console.log('----------')
    console.log(c_token,c_type,c_school_name)
    

    if(c_token && c_type && c_school_name){
        user_School_Number = getUrlParam('token');
        category = getUrlParam('type');
        school_name = getUrlParam('school');
        user_info_ready = 1;
        console.log(user_School_Number,category,school_name)
        //console.log('change',user_info_ready);
    }
    
    // }else if(c_token){
    //     //console.log('TOKEN!!!')
    //     let token = getUrlParam('token');
    //     setting_game();

    //     user_School_Number = token;
    //     document.querySelector('#school_number').value = token;
    //     //school_number({keyCode: 13});

    // }else if(c_type){
    //     //console.log('TYPE!!!')
    //     let type = getUrlParam('type');
    //     set_category(type);
    // }


    //http://127.0.0.1:5501/?token=20402?type=%EC%A7%80%EC%88%98
})

function hasParam(key) {
    return url.searchParams.has(key)
}

function getUrlParam(key) {
    return url.searchParams.get(key)
}