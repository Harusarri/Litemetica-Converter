const nbt = require("prismarine-nbt");
const { Buffer } = require('buffer');

document.getElementById("uploadForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const file = document.getElementById("file").files[0];
    const reader = new FileReader();
    reader.onload = async () => {
        const buffer = reader.result;
        const data = await nbt.parse(Buffer.from(pako.inflate(buffer)));
        const nbt_data = data.parsed.value;

        nbt_data.MinecraftDataVersion.value = parseInt(document.getElementById("targetVersion").value);

        if (targetVersion >= 3463) {
            nbt_data.Version.value = 7;
        } else if (targetVersion >= 3218 && targetVersion < 3463) {
            nbt_data.Version.value = 6;
        } else if (targetVersion <= 2586) {
            nbt_data.Version.value = 5;
        } else {
            nbt_data.Version.value = 6;
        }

        const outputBuffer = pako.gzip(nbt.writeUncompressed(data.parsed));

        // now let's download something... except js needs us to simulate click on a link :skull:
        const blob = new Blob([outputBuffer]);
        console.log(blob);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = file.name;
        link.click();
    };
    reader.readAsArrayBuffer(file);
});

