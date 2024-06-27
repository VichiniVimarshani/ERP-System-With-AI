import axios from "axios";

const PostDataService = async (endoint: string, data: any) => {
    try {
        const baseURL = `http://localhost:8090/`
        await axios.post(baseURL + endoint, data)
            .then((res: any) => {
              
                 return  res
            })
            .catch((err) => {
                return err
            })

    } catch (error) {
        console.error('Error fetching data: ', error);

    }
}
export default PostDataService;