import path from "path"
import DataURIParser from "datauri/parser.js";


interface File {
    originalname : string;
    buffer : Buffer
}

const parser = new DataURIParser()
const DataUri = (file : File) =>{
    const extName = path.extname(file.originalname).toString()
    return parser.format(extName , file.buffer).content
}

export default DataUri