const deleteList = async (req, res) => {

    const { list_id } = JSON.parse(JSON.stringify(req.body.body));

    const client = require("@mailchimp/mailchimp_marketing");
    
    client.setConfig({
        apiKey: `${process.env.APIKEY}-us17`,
        server: "us17",
    });
  
    try {
        const response = await client.lists.deleteList(list_id);     
        // console.log('lists.deleteList', response);
        return res.status(200).json(response);
    } catch (err) {
        // console.log('err', err.response.res.text);
        return res.status(500).json(err.response);
    }
};
  
export default deleteList;
