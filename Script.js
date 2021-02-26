let questionsArray = []; // this is a global array that will contain the questions you asked form the mock db function. 
let urlHelper = [];
var score; //holds the score
var attemptsLeft; //hold the number of times the user can get a question wrong
var startPosition = document.getElementById("mainDiv").innerHTML;//holds the intial state of the html page
var questionAmount; //for displaying the total amount of questions the player is going to answer
var questionNumber; //for displaying the current question
var questionIndex; //holds the index of the current question

// this function let the elements in your html to load first.
$(document).ready(function () { 
    // getCategories is a mock DB function that recive 'select' html element, and fill the select with the categories from opentdb.
	// please note that in order to operate the function, in your html there should be a select element that hold the id categories.
	getCategories($("#categories"));

	document.getElementById("start").addEventListener("click", ()=>{start();})
	
	
});

function reset(){
	//this function is called if the user wants to play again after the game is over.

	document.getElementById("mainDiv").innerHTML = startPosition;
	getCategories($("#categories"));

	document.getElementById("start").addEventListener("click", ()=>{start();})
}
async function start(){ 
//the start function initializes the need variables with the appropriate values, and then calls the showQuestion function.

	score=0; //the intinal score is 0
	attemptsLeft=3; //the player starts with 3 attempts to get a question wrong
	questionNumber=1;//the first question is question number 1 
	questionIndex = 0;//the index of the first question is 0
	
	//initializing variables with data from the page.
	var amount = document.getElementById("amount").value;
	var difficulty = document.getElementById("difficulty").value;
	var categorySelected = document.getElementById("categories").value;
	var type = document.getElementById("type").value;
	
	//questionAmount is used to show to the player how many questions he has in the current game.
	questionAmount = amount;
	
	// getQuestion is an async function. in order to use it you have to use the keyword await.
	questionsArray =  await getQuestion(amount , categorySelected , difficulty ,type);
	
	showQuestion(questionIndex, type)
}

function showQuestion(questionIndex, type){
	//this function shows the question to the player.
	//it needs the index of the current question to show the question and possible answers
	//itn needs the type to know how many, and which posibble answers to show

	let optionOne;
	let optionTwo;
	let optionThree;
	let optionFour;
	
	let	str="";
		str+=`<div id='question'> ${questionsArray[questionIndex]['question']} </div>` ;
		
	//the layout of the possible answers is determined by the type of the question
	if(type=='boolean'){

		let rnd = Math.floor(Math.random()*2);
				//randomizes the placement of the correct answer
				if(rnd==0){
					optionOne = questionsArray[questionIndex]['correct_answer'];
					optionTwo = questionsArray[questionIndex]['incorrect_answers'];
				}else{
					optionTwo = questionsArray[questionIndex]['correct_answer'];
					optionOne = questionsArray[questionIndex]['incorrect_answers'];
				}
				
		//conctanating the answer divs. 
		//each answer, if clicked, sends its value and the index of the current question.
		str+=`<div id='optionOne' onclick=\" checkAnswer(\'${optionOne}\',${questionIndex})\"> ${optionOne} </div>` ;
		str+=`<div id='optionTwo' onclick=\"checkAnswer(\'${optionTwo}\', ${questionIndex})\"> ${optionTwo} </div>` ;

		
	}else{

		let rnd = Math.floor(Math.random()*4);
				//randomizes the placement of the correct answer
				if(rnd==0){
					optionOne = questionsArray[questionIndex]['correct_answer'];
					optionTwo = questionsArray[questionIndex]['incorrect_answers'][0];
					optionThree = questionsArray[questionIndex]['incorrect_answers'][1];
					optionFour = questionsArray[questionIndex]['incorrect_answers'][2];
			}else if(rnd==1){
				optionTwo = questionsArray[questionIndex]['correct_answer'];
				optionOne = questionsArray[questionIndex]['incorrect_answers'][0];
				optionThree = questionsArray[questionIndex]['incorrect_answers'][1];
				optionFour = questionsArray[questionIndex]['incorrect_answers'][2];	
			}else if(rnd==2){
				optionThree = questionsArray[questionIndex]['correct_answer'];
				optionTwo = questionsArray[questionIndex]['incorrect_answers'][0];
				optionOne = questionsArray[questionIndex]['incorrect_answers'][1];
				optionFour = questionsArray[questionIndex]['incorrect_answers'][2];	
			}else if(rnd==3){
				optionFour = questionsArray[questionIndex]['correct_answer'];
				optionThree = questionsArray[questionIndex]['incorrect_answers'][0];
				optionTwo = questionsArray[questionIndex]['incorrect_answers'][1];
				optionOne = questionsArray[questionIndex]['incorrect_answers'][2];	
			}

		//conctanating the answer divs. 
		//each answer, if clicked, sends its value and the index of the current question.
		str+=`<div id='optionOne' onclick=\"checkAnswer(\'${optionOne}\',${questionIndex})\"> ${optionOne} </div>` ;
		str+=`<div id='optionTwo' onclick=\"checkAnswer(\'${optionTwo}\', ${questionIndex})\"> ${optionTwo} </div>`;
		str+=`<div id='optionThree' onclick=\"checkAnswer(\'${optionThree}\', ${questionIndex})\"> ${optionThree} </div>` ;
		str+=`<div id='optionFour' onclick=\"checkAnswer(\'${optionFour}\', ${questionIndex})\"> ${optionFour} </div>` ;
		
		
	}
		//concatinating the status divs, and then injecting the string into the main div.
		str+=`<div id='questionLeft'>Question ${questionNumber} of ${questionAmount}</div>`;
		str+=`<div id='score' >Score: ${score}</div>`;
		str+= `<div id='attempts' >Attempts Left: ${attemptsLeft}</div>`;
		document.getElementById("mainDiv").innerHTML = str;
}


function checkAnswer(userAnswer, questionIndex){
//this function checks if the answer the user choose is correct.
//it recives the user's answer and the index of the question, thus it is able to determine if the user's answer is correct.

if(userAnswer == questionsArray[questionIndex]['correct_answer']){
	score+=10;
}else{
	attemptsLeft--;//if the user is wrong, he loses a "life."
}
	questionIndex++;//next question
	questionNumber++;//next question number

	CheckGameOver(questionIndex)
	
}

function CheckGameOver(questionIndex){
	//this function checks if the game is over.
	//the game is over if either the user has no more questions to answer, or if the user was wrong on 3 questions.

	if(questionIndex==questionsArray.length || attemptsLeft==0){
			endGame()
	}else{
		showQuestion(questionIndex,questionsArray[questionIndex]['type'])
	}
	
}

function endGame(){
	//this function is called when the game is over
	//it shows on the page the user's score, and a reset button to restart the game.
	str=`<div class='endGame' >Your Score Is: ${score} </div>`;
	str+="<button class='endGame' onclick='reset()'>Play Again</button>";
document.getElementById("mainDiv").innerHTML = str;


}


// Mock DB functions you should not edit!

function getCategories(select) {

    $.ajax({
        url: "https://opentdb.com/api_category.php",
        context: document.body
    }).done(function (data) {
        categories = data.trivia_categories;
        for (i in categories) {
            let cat = categories[i];
            let option = "<option value=" + cat.id + ">" + cat.name + "</option>"
			select.append(option);
			
        }
	});
	
}
function editUrl(amount, category , difficulty,type){
	urlHelper["amount"]='amount=' + amount;
	urlHelper["category"]='category=' + category;
	urlHelper["difficulty"]='difficulty=' + difficulty;
	urlHelper["type"]='type=' + type;
}
   
async function getQuestion(amount, category , difficulty,type) {
	editUrl(amount, category , difficulty,type);
	var arr= [] ;
    var url = 'https://opentdb.com/api.php?' + urlHelper.amount
            + '&' + urlHelper.category
            + '&' + urlHelper.difficulty
            + '&' + urlHelper.type
			
	var res = await fetch(url);
	var data = await res.json();
	return data.results;
}