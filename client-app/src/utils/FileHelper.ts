export class FileHelper {
    public static getBinary = async (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target) {
                    const arrayBuffer = event.target.result;
                    resolve(arrayBuffer);
                }
                else {
                    reject("No event target");
                }
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    }
}