export default function render(game) {
    var canvas = document.getElementById("main_canvas")
    var ctx = canvas.getContext("2d")
    
    //Clear
    ctx.clearRect(0,0,100,100)

    //Configurations
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 4

    drawArena(ctx, game.state.size.width, game.state.size.height)

    // //Draw Players
    // ctx.fillRect(5,5,10,30)
    // ctx.fillRect(width-15,5,10,30)

    // //Draw Points
    // ctx.font = "25px roboto"
    // ctx.fillText('0', width/2-30, 30)
    // ctx.fillText('0', width/2+17, 30)
}

function drawArena(ctx, width, height) {

    //Draw bounds
    ctx.strokeRect(0,0,width,height)

    //Draw dotted lines
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.setLineDash([10,10])
    ctx.moveTo(width/2, 5)
    ctx.lineTo(width/2, height)
    ctx.stroke()

}