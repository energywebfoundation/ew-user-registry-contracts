var Sloffle = require("sloffle")
const { exec } = require('child_process');

const main = async () => {

    await Sloffle.wrapping("dist/contracts", "src/wrappedContracts")

}

main()