import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import classes from './Main.module.scss';


export default function MailchimpAuto (props) {
    const router = useRouter();

    const [listId, setListId] = useState(null);
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
            // console.log('get list id:', res.data.lists[0].id);
            return res.data.lists[0].id;
        } // else { console.log(res); };
    };

    // 2. post subscribers' email
    const handleBatchSubscribe = async (data) => {
        const res = await axios.post("api/batch-subscribe", {
            body: { list_id: data.listId },
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
            // console.log('get template id:', targetTemplate.id);
            return targetTemplate.id;
        } // else { console.log(res); };
    };

    // 4. create a new campaign from my template
    const handleAddCampaign = async(data) => {
        const res = await axios.post("/api/add-campaign", {
            body: { list_id: data.listId, template_id: data.templateId },
        });
        if (res.status===200) {
            setCampaignId(res.data.id);  
            setCampaignUrl(res.data.archive_url);  
            // console.log('campaign id:', res.data.id, res.data.archive_url);
            return res.data.id
        } // else { console.log(res); };
    };
    
    // 5. send campaign to the subscribers
    const handleSendCampaign = async (data) => {
        const res = await axios.post("/api/send-campaign", {
            body: { campaign_id: data.campaignId },
        });
        if (res.status===200) {
            setCampaignSent(true);
            // console.log('campaign sent');
        } // else { console.log(res); };
    };
    
    // 6. get campaign content
    const handleGetCampaignContent = async (data) => {
        const res = await axios.post("api/get-campaign-content", {
            body: { campaign_id: data.campaignId },
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
        } // else { console.log(errMessage); };
    };

    const handleClickAuto = async() => {
        const resListId = await handleGetListsInfo();
        await handleBatchSubscribe({listId: resListId});
        const resTemplateId = await handleGetListTemplates();
        const resCampaignId = await handleAddCampaign({listId: resListId, templateId: resTemplateId});
        await handleSendCampaign({campaignId: resCampaignId});
        await handleGetCampaignContent({campaignId: resCampaignId});
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

    function getStyle (state) {
        return state ? {color:'green'} : null;
    }
    
    return (
        <div className={classes.container} id={classes.auto_container}>
            <div className={classes.step} id={classes.auto_step}>
                <button
                    onClick={handleClickAuto}
                    className={classes.auto_btn}
                >Execute</button>
            </div>

            <div className={classes.step} id={classes.auto_step}>
                <p style={getStyle(listId)} id={classes.auto_p}>Create List</p>
                {listId && <p id={classes.auto_p}>Get list_id: {listId}</p>}
            </div>

            <div className={classes.step} id={classes.auto_step}>
                <p style={getStyle(emailList)} id={classes.auto_p}>Add Email To The List</p>
                {emailList && (
                    <div>
                        <p id={classes.auto_p}>Subscribed:&emsp;</p>
                        {emailList && (
                            <div id={classes.mails}>
                                {emailList.map(ele => {
                                    const mailArr = ele.split('@');
                                    const l = mailArr[0].length - 3;
                                    const sub0 = mailArr[0].slice(0,3);
                                    const sub1 = Array.from({length: l}, (v,k) => '*').join('');
                                    return <p key={ele} id={classes.auto_p}>{`${sub0}${sub1}@${mailArr[1]}`},&ensp;</p>
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={classes.step} id={classes.auto_step}>
                <p style={getStyle(templateId)} id={classes.auto_p}>Get Email Template</p>
                {templateId && <p id={classes.auto_p}>Get template_id: {templateId}</p>}
            </div>

            <div className={classes.step} id={classes.auto_step}>
                <p style={getStyle(campaignId)} id={classes.auto_p}>Create Campaign From The Template</p>
                {campaignId && <p id={classes.auto_p}>Add campaign_id: {campaignId}</p>}
            </div>

            <div className={classes.step} id={classes.auto_step}>
                <p style={getStyle(campaignSent)} id={classes.auto_p}>Send The Campaign To The List</p>
                {campaignSent && <p id={classes.auto_p}>Campaign sent</p>}
            </div>

            <div className={classes.step} id={classes.auto_step}>
                <p style={getStyle(contentText)} id={classes.auto_p}>Get The Campaign</p>
                {contentText && <p id={classes.auto_p}>Get campaign content ↓<br/></p>} 
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

            <div className={classes.step} id={classes.auto_reset_wrapper}>
                <button 
                    onClick={() => router.reload()}
                    disabled={!listId}
                    className={classes.auto_btn}
                    id={classes.auto_reset}
                >Reset</button> 
            </div>
        </div>
    )
};