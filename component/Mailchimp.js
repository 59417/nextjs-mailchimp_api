import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import classes from './Main.module.scss';


export default function Mailchimp () {
    const router = useRouter();

    const [listId, setListId] = useState(null);
    const [addListId, setAddListId] = useState(null);
    const [emailList, setEmailList] = useState(null);
    const [templateId, setTemplateId] = useState(null);
    const [campaignId, setCampaignId] = useState(null);
    const [campaignUrl, setCampaignUrl] = useState(null);
    const [campaignSent, setCampaignSent] = useState(null);
    const [contentText, setContentText] = useState(null);
    const [contentImg, setContentImg] = useState(null);
  
    // 1. check if any list exists => list exists: setListId('list_id')
    const handleGetListsInfo = async () => {
        const res = await axios.get("api/get-lists-info");
        if (res.status===200 && res.data.lists.length > 0) {
            setListId(res.data.lists[0].id);
            // console.log('get list id:', res.data.lists[0].id)
        } // else { console.log(res); };
    };
    
    // 1-2. no list: add list
    const handleAddList = async () => {
        const res = await axios.get("api/add-list");
        if (res.status===200) {
            setListId(res.data.id);  
            setAddListId(res.data.id);
            // console.log('List added:', res.data.id);
        } // else { console.log(res); };
    };

    // 2. post subscribers' email
    const handleBatchSubscribe = async () => {
        const res = await axios.post("api/batch-subscribe", {
            body: { list_id: listId },
        });
        if (res.status===200) {
            const newEmail = res.data.new_members;
            const errEmail = res.data.errors;
            const emailArr = [];
            if (newEmail.length > 0) {
                const arr = newEmail.map(obj=>obj.email_address);
                emailArr.push(...arr);
            };
            if (errEmail.length > 0) {
                const arr = errEmail.map(obj=>obj.email_address);
                emailArr.push(...arr);
            };
            setEmailList(emailArr);
            // console.log('Subscribed');
        } // else { console.log(res); };
    };
    
    // 3. get my email template id
    const handleGetListTemplates = async () => {
        const res = await axios.get("api/get-list-templates");
        if (res.status===200) {
            const targetTemplate = res.data.templates.filter(obj=>obj.type==='user')[0];
            setTemplateId(targetTemplate.id);
            // console.log('get template id:', targetTemplate.id)
        } // else { console.log(res); };
    };

    // 4. create a new campaign from my template
    const handleAddCampaign = async() => {
        setCampaignId("id");
        const res = await axios.post("/api/add-campaign", {
            body: { list_id: listId, template_id: templateId },
        });
        if (res.status===200) {
            setCampaignId(res.data.id);  
            setCampaignUrl(res.data.archive_url);  
            // console.log('campaign id:', res.data.id, res.data.archive_url);
        } // else { console.log(res); };
    };
    
    // 5. send campaign to the subscribers
    const handleSendCampaign = async () => {
        setCampaignSent("sent");
        const res = await axios.post("/api/send-campaign", {
            body: { campaign_id: campaignId },
        });
        if (res.status===200) {
            setCampaignSent(true);
            // console.log('campaign sent');
        } // else { console.log(res); };
    };
    
    // 6. get campaign content
    const handleGetCampaignContent = async () => {
        const res = await axios.post("api/get-campaign-content", {
            body: { campaign_id: campaignId },
        });
        if (res.status===200) {
            const resData = res.data.html;
            setContentText(resData.split('<td').filter(ele=>ele.includes('<h1'))[0]);
            setContentImg(
                resData.split('<img')
                .filter(ele=>ele.includes(`class="mcnImage"`))[0]
                .split(' ')
                .filter(ele=>ele.includes('src'))[0]
                .replace(`src="`, '')
                .replace(`"`, '')
            );
            // console.log('get campaign content');
        } // else { console.log(res); };
    };

    // return campaign content html string
    function showContent () {
      const rawText = contentText.split('</td>')[0];
      let title = rawText.split('</h1>')[0].split('span')[1];
      title = title.substring(title.indexOf('>')+1, title.indexOf('<'));
      title = `<h1>${title}</h1>`;
      
      let paragraph = rawText.split('</h1>')[1];
      paragraph = paragraph.replaceAll('<br>', '<br/>');

      return `<div>${title+paragraph}</div>`;
    };  
    
    return (
        <div className={classes.container}>
            
            {/* 1. check if any list exists => list exists: setListId('list_id') */}
            <div className={classes.step}>
                <button 
                    onClick={handleGetListsInfo}
                    disabled={!!listId}
                    className={classes.manual_btn}
                >Get Lists Info</button>
                {listId && <p>Get list_id: {listId}</p>}
            </div>
    
            {/* 1-2. no list: add list */}
            {!listId && !addListId ? (
                <div className={classes.step}>
                    <button 
                        onClick={handleAddList}
                        disabled={!addListId&&!listId}
                        className={classes.manual_btn}
                    >Add List</button>
                    {addListId && <p>Add list_id: {addListId}</p>}
                </div>
            ) : null}

            {/* 2. post subscribers' email */}
            <div className={classes.step}>
                <button 
                    onClick={handleBatchSubscribe}
                    disabled={!!emailList||!listId}
                    className={classes.manual_btn}
                >Batch Subscribe</button>
                {emailList && (
                    <div>
                        <p id={classes.subscribe}>Subscribed:&emsp;</p>
                        {emailList && (
                             <div id={classes.mails}>
                                {emailList.map(ele => {
                                    const mailArr = ele.split('@');
                                    const l = mailArr[0].length - 3;
                                    const sub0 = mailArr[0].slice(0,3);
                                    const sub1 = Array.from({length: l}, (v,k) => '*').join('');
                                    return <p key={ele}>{`${sub0}${sub1}@${mailArr[1]}`},&ensp;</p>
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 3. get my email template id */}
            <div className={classes.step}>
                <button 
                    onClick={handleGetListTemplates}
                    disabled={!!templateId||!emailList}
                    className={classes.manual_btn}
                >Get List Templates</button>
                {templateId && <p>Get template_id: {templateId}</p>}
            </div>
            
            {/* 4. create a new campaign from my template */}
            <div className={classes.step}>
                <button 
                    onClick={handleAddCampaign}
                    disabled={!!campaignId||!templateId}
                    className={classes.manual_btn}
                >Add Campaign</button> 
                {campaignId && <p>Add campaign_id: {campaignId}</p>}
            </div>
    
            {/* 5. send campaign to the subscribers */}
            <div className={classes.step}>
                <button 
                    onClick={handleSendCampaign}
                    disabled={!!campaignSent||!campaignId}
                    className={classes.manual_btn}
                >Send Campaign</button>  
                {campaignSent && <p>Campaign sent</p>}
            </div>
            
            {/* 6. get campaign content */}
            <div className={classes.step}>
                <button 
                    onClick={handleGetCampaignContent}
                    disabled={!!contentText||!campaignSent}
                    className={classes.manual_btn}
                >Get Campaign Content</button> 
                {contentText && <p>Campaign content shows below:<br/></p>} 
            </div>
            
            <div className={classes.content}>
                {!contentText && 'No Content'}
                {contentImg && <img src={contentImg} alt="content-img" width={'100%'}/>}
                {contentText && parse(showContent())}
                {campaignUrl && (
                    <a 
                        rel="noopener noreferrer"
                        target="_blank"
                        href={campaignUrl}
                    >View campaign in broswer</a>
                )}
            </div>

            <div className={classes.step} id={classes.manual_reset_wrapper}>
                <button 
                    onClick={() => router.reload()}
                    disabled={!listId}
                    className={classes.manual_btn}
                    id={classes.manual_reset}
                >Reset</button> 
            </div>
    
        </div>
    )
};