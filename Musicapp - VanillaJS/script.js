window.addEventListener("load",() => {
    const sounds = document.querySelectorAll("audio");
    const pads = document.querySelectorAll(".pads div");
    const visual = document.querySelector(".visual");
    console.log(visual);
    let colors = [];

pads.forEach((pad,index) => {
    colors.push(window.getComputedStyle(pad, null).getPropertyValue("background-color"));
    pad.addEventListener("click",function(){
        sounds[index].currentTime = 0;
        sounds[index].play();
        creatBubbles(index);
    })
})
    
const creatBubbles = (index) => {
    const bubble = document.createElement("div");
    visual.append(bubble);
    bubble.style.backgroundColor = colors[index];
    bubble.style.animation = "jump 1s ease";
    bubble.addEventListener("animationend", function(){
        visual.removeChild(this);
    })
}

})