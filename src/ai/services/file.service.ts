import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as Path from "path";

const FILE_PATH = './uploads';

@Injectable()
export class FileService {
    filePath = FILE_PATH;
    constructor() {}

    private readFile (fileName: string, folderPath: string = this.filePath) {
        return fs.readFileSync(Path.join(folderPath, fileName))
    }

    /**
     * write file content to folder
     * @param file 
     * @returns 
     */
    async writeFile (file: any) {
        // file Name
        const fileName = `${Date.now()}-${file.originalName}`

        // path of file
        const filePath = Path.join(this.filePath, fileName);

        try {
            await fs.writeFileSync(filePath, file.buffer);
            console.log('File written successfully');

            return fileName;
        } catch (err) {
            console.error('Error writing file:', err);
            throw new BadGatewayException('Error in writing file');
        }
    }

    /**
     * get buffer content of file 
     * @param fileName 
     * @returns 
     */
    getBufferedFile (fileName: string) {
        try {
            return Buffer.from(this.readFile(fileName)).toString("base64");
        } catch (error) {
            throw new BadGatewayException('Error reading file: ' + fileName);
        }
    }

    /**
     * remove file from server
     * @param filePath 
     */
    removeFile(fileName) {
        try {
            fs.unlink(Path.join(this.filePath, fileName), (error) => {
                if (error) {
                    console.error('Error removing file:', error);
                } else {
                    console.log('File removed successfully');
                }
            });
        } catch (err) {
            console.error('Exception caught while trying to remove the file:', err);
        }
    }

    async readPdf(filePath) {
        new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    throw err;
                }

                resolve(data);
            });
        })
    }
}