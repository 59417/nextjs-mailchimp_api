const test = async (req, res) => {
    console.log('==============================================================================');
    console.log('==============================================================================');
    console.log('==============================================================================');

    const aa = process.env.HOSTNAME;
    const bb = process.env.APIKEY;
    const cc = process.env.EMAILA;
    const dd = process.env.EMAILB;
    const ee = process.env.EMAILC;

    console.log(aa,bb,cc,dd,ee);

    return res.status(200).json({res: 'good'});
};

export default test;

