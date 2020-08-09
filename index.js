const fs = require('fs');

const http = require('http');

const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf8');

const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
    
    const pathname = url.parse(req.url,true).pathname;

    const id = url.parse(req.url,true).query.id;

    if(pathname==="/products"||pathname==="/"){
        res.writeHead(200, { 'Content-Type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-overview.html`, "utf-8", (err, data) => {
            
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, "utf-8", (err, data) => {
                
                const cardsOutput =laptopData.map(item=>replaceTamplates(data, item)).join("");

                overviewOutput = overviewOutput.replace("{%CARDS%}",cardsOutput);

                res.end(overviewOutput);
            })
        })
        
    
    } else if(pathname==="/laptop" && id<laptopData.length){
        res.writeHead(200, { 'Content-Type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-laptop.html`,"utf-8",(err, data)=>{
            const laptop = laptopData[id];
            
            const output = replaceTamplates(data,laptop)

            res.end(output);
        })
    } else if ((/\.(jpg|jpeg|gif|png)$/i).test(pathname)){
        fs.readFile(`${__dirname}/data/img${pathname}`,(err, data) => {
            res.writeHead(200, {'Content-Type':"image/jpg"});

            res.end(data);
        })
    }

    else{
        res.writeHead(404, { 'Content-Type': 'text/html'});

        res.end("page not found")
    }
})

server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on port 3000");
})

function replaceTamplates(originalHTML,laptop){
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}