var solc = require('solc')
var fs = require('fs')



var input = fs.readFileSync(process.argv[2], "utf8")
// 'input' is a JSON string corresponding to the "standard JSON input" as described in the link above
// 'findImports' works as described above
var output = solc.compileStandardWrapper(input, findImports)


fs.writeFile("output.json", output, function (err) {
    if (err) throw err;
    console.log('complete');
}

);// Ouput is a JSON string corresponding to the "standard JSON output"
console.log((output))


function findImports(url) {

    console.log("")
    console.log("url: " + url)
    console.log("")

    path = url.split("://")
    console.log("")

    console.log("path: " + path)
    console.log("")

    console.log("path[0]: " + path[0])
    console.log("")

    if (path.length == 1) {
        return { contents: fs.readFileSync("./contracts/" + url, "utf8") }
    }

    switch (path[0]) {
        case "http": break
        case "file":
            return { contents: fs.readFileSync(path[1], "utf8") }
        default: throw new Error("unknown protocol")

    }
}