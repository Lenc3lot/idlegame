const tabRessources = document.getElementById("resourcesTab");
let paused = false;
let auto = false;
let monargent = document.getElementById("argent");
let monargenttotal = document.getElementById("argTot");
let innovDisplay = document.getElementById("innovDisplay");
let celeb = document.getElementById("celeb");
const buyAmount = document.getElementById("buyAmount");
const autoBtn = document.getElementById("autoBtn");
const innovBtn = document.getElementById("prsBtn");
const lvlprest = 1e4;
let btn = false;

buyAmount.addEventListener("change",function(ev){
	player.buyQuantity = ev.target.value;
})

autoBtn.addEventListener("click",function(ev){
	if(!btn){
		btn = true;
		autoBtn.style.background = "green";
		monInterval = setInterval(function(){
			document.getElementsByName("buyButton").forEach((elem)=> {
				elem.click();
			})
		},500);
	}else{
		btn = false;
		autoBtn.style.background = "red";
		clearInterval(monInterval);
	}	
})

innovBtn.addEventListener("click",function(ev){
	console.log(player.totalMoneyEarned);
	console.log (lvlprest);
	if(player.totalMoneyEarned > lvlprest){
		let maconfirm = window.confirm("Voulez vous reset pour "+ (player.totalMoneyEarned - lvlprest)/100 + " prestige ?",false);
		console.log(maconfirm);
		if(maconfirm){
			clearInterval(intervalcalcul);
			player.prestige += (player.totalMoneyEarned - lvlprest)/100;
			window.localStorage.setItem("idlePlayerPrestige",player.prestige);
			player.money = 100;
			player.totalMoneyEarned = 0;
			for (const [key, value] of Object.entries(player.ressources)) {
				//Reset amount
				value["amount"] = 0;
				//Reset cost
				value["cost"] = value["baseCost"];
				//Reset valuePerSec
				value["valuePerSec"] = value["valuePerSec"]*(player.prestige);
				//Reset actualValuePerSec
				value["actualValuePerSec"] = value["valuePerSec"];
			}
			intervalcalcul = setInterval(function(){whatever()},1000);
			//reset(true);	

		}
	}
})

let defaultHandler = {
	get(target, key, value) {
		return target[key];
	},
	set(target, key, value) {
		if (key == "money") {
			monargent.innerHTML = value;
		};
		if (key == "buyQuantity"){
			console.log("CHNG");
			console.log(player.buyQuantity);
			//Chng les valeurs des boutons
			document.getElementsByName("buyButton").forEach((elem) => {
				elem.innerHTML = "Acheter x"+value;
			});
		}
		if (key == "totalMoneyEarned") {
			monargenttotal.style.display ="block";
			monargenttotal.innerHTML = "Argent Total : " + value;

		}
		if(key == "prestige"){
			innovDisplay.style.display = "block";
			celeb.innerHTML = value;
		}
		target[key] = value;
	}
};

let amountHandler = {	
	get(target, key, value) {
		return target[key];
	},
	set(target, key, value) {
		if (key == "amount") {
			target.amountDisplay.innerHTML = value; 			
		}
		if(key == "actualValuePerSec"){
			target.costSecondDisplay.innerHTML = target.actualValuePerSec;
		}
		if (key == "cost") {
			target.costDisplay.innerHTML = value;
			if (player.money < target["cost"]) {
				target.btnDisplay.style.color = "red";
			} else {
				target.btnDisplay.style.color = "black";
			}
		}
		target[key] = value;
	}
}

let player = load();

if (!player) {
	player = {
		money: 100,
		totalMoneyEarned: 0,
		prestige: 0,
		buyQuantity: 1,
		ressources: {
			T1: {
				name: "Stagiaire",
				amount: 0,
				baseCost: 100,
				factor: 1.17,
				cost: 100,
				valuePerSec: 10,
				actualValuePerSec: 10,

			},
			T2: {
				name: "Alternant",
				amount: 0,
				baseCost: 215,
				factor: 1.18,
				cost: 215,
				valuePerSec: 25,
				actualValuePerSec: 25
			},
			T3: {
				name: "Développeur Junior",
				amount: 0,
				baseCost: 500,
				factor: 1.20,
				cost: 500,
				valuePerSec: 75,
				actualValuePerSec: 75
			},
			T4: {
				name: "Developpeur Front",
				amount: 0,
				baseCost: 2000,
				factor: 1.22,
				cost: 2000,
				dispCost: null,
				dispAmount: null,
				dispBuy: null,
				valuePerSec: 200,
				actualValuePerSec: 200
			},
			T5: {
				name: "Développeur Back",
				amount: 0,
				baseCost: 30000,
				factor: 1.25,
				cost: 30000,
				dispCost: null,
				dispAmount: null,
				dispBuy: null,
				valuePerSec: 1500,
				actualValuePerSec: 1500
			},
			T6: {
				name: "Developpeur Full Stack",
				amount: 0,
				baseCost: 100000,
				factor: 1.30,
				cost: 100000,
				dispCost: null,
				dispAmount: null,
				dispBuy: null,
				valuePerSec: 6000,
				actualValuePerSec: 6000
			},
			T7: {
				name: "M.Noto",
				amount: 0,
				baseCost: 1000000,
				factor: 2.30,
				cost: 1000000,
				dispCost: null,
				dispAmount: null,
				dispBuy: null,
				valuePerSec: 60000,
				actualValuePerSec: 60000
			}
		}
	}
}

player = new Proxy(player,defaultHandler);

for (const [key, value] of Object.entries(player.ressources)) {
	//Déclaration des différents éléments du tableau
	player.ressources[key] = new Proxy(value, amountHandler);
	let monTR = document.createElement("TR");
	let monTDName = document.createElement("TD");
	let monTDCost = document.createElement("TD");
	let monTDApport = document.createElement("TD");
	let monTDAmount = document.createElement("TD");
	let monTDButton = document.createElement("TD");

	//création du bouton et ajout
	let buyButton = document.createElement("BUTTON");
	buyButton.name = "buyButton";
	buyButton.innerHTML = "Acheter x" + player.buyQuantity;
	buyButton.addEventListener("click", function () {
		acheter(player.ressources[key])
	});
	monTDButton.appendChild(buyButton);

	value["btnDisplay"] = buyButton;

	console.log(`Key : ${key}, Value : ${value}`);

	//ajout des éléments TD dans le TR
	monTDName.innerHTML = value["name"];
	monTDCost.innerHTML = value["cost"];
	monTDApport.innerHTML = value["valuePerSec"];
	monTDAmount.innerHTML = value["amount"];
	monTR.appendChild(monTDName);
	monTR.appendChild(monTDCost);
	monTR.appendChild(monTDApport);
	monTR.appendChild(monTDAmount);
	monTR.appendChild(monTDButton);
	tabRessources.appendChild(monTR);

	value["costSecondDisplay"] = monTDApport;
	value["costDisplay"] = monTDCost;
	value["amountDisplay"] = monTDAmount;
} 	

const buyButton = document.getElementsByName("buyButton");

function majCosts(item) {
	item.cost = calculateCost(item);
}

function whatever(){
	for (const [key, item] of Object.entries(player.ressources)) {
		player.money += item["amount"] * item["valuePerSec"];
		player.totalMoneyEarned += item["amount"] * item["valuePerSec"];
		majCosts(item)
	}
	save();
}

let intervalcalcul = setInterval(function () {
	whatever();
}, 1000);


function calculateCost(item) {
	let calcAmount = item.amount;
	let calcCost = item.baseCost + Math.ceil(item.baseCost * calcAmount * item.factor);
	if (player.buyQuantity >= 1) {
		let i = 1;
		while (i < player.buyQuantity) {
			calcAmount++;
			calcCost += item.baseCost + Math.ceil(item.baseCost * calcAmount * item.factor);
			i++;
		}
	}
	else {
		let outOfMoney = false;
		while (!outOfMoney) {
			calcAmount++;
			if (item.baseCost + Math.ceil(item.baseCost * calcAmount * item.factor) + calcCost <= player.money) {
				calcCost += item.baseCost + Math.ceil(item.baseCost * calcAmount * item.factor);
			}
			else {
				outOfMoney = true;
			}
		}
		item.actualBuyAmount = calcAmount - item.amount;
	}
	return calcCost;
}

function acheter(item) {
	console.log(item["amount"]);
	if (player.money >= item["cost"]) {
		// player.totalMoneyEarned = player.money;
		player.money = player.money - item["cost"];
		item["amount"] += Number(player.buyQuantity);
		console.log("achat réussi");
		console.log(item["amount"]);
		majCosts(item);
	} else {
		console.log("échec de l'achat");
	}
}

function save() {
	window.localStorage.setItem("idlePlayer", JSON.stringify(player));
	console.log("Sauvegarde auto effectuée !")
}


function load() {
	if(window.localStorage.getItem("idlePlayer")){
		JSON.parse(window.localStorage.getItem("idlePlayer"));
		//player.prestige = JSON.parse(window.localStorage.getItem("idlePlayerPrestige"));
	}else{
		return null;
	}
}



function prestige() {

}

function dev(ev) {
	player.money += 10;
	player.totalMoneyEarned += 10;
	createFloatingText(ev, "+10");
}

function createFloatingText(ev, txt) {
	let elem = document.createElement("H1");
	elem.innerHTML = txt;
	elem.style.left = ev.clientX + 'px';
	elem.style.top = ev.clientY + 'px';
	ev.target.parentNode.appendChild(elem);
	setTimeout(function () {
		elem.parentNode.removeChild(elem);
	}, 2000);
}

function reset(bool){
	if(bool){
		let confirm = window.confirm("Oh t'es sur de reset ?");
		console.log("blib")
		if(confirm){
			clearInterval(intervalcalcul);
			window.localStorage.setItem("idlePlayer",null);
			console.log()
			setTimeout(location.reload(),5000);
		}
		
	}
}	

// console.log(buyButton[0]);
// buyButton[0].addEventListener("click",function(){
// 	acheter(player.ressources.T1)
// });



//init script
buyAmount.value = 1;
player.buyQuantity = 1;





//Parcours la totalité des éléments de l'objet player



