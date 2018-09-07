/* OA板块 */
var moduleID_Notice = "A01A11"; 			//公告发布权
var moduleID_MemberSet = "A01A10";  		//成员设置权
var moduleID_DepartSet = "A01A09";  		//部门设置权
var moduleID_EnterpriseInfoSet = "A01A01";  //企业信息维护权
var moduleID_OrderCenter = "A01A15";        //是否能看见订单中心



/* 公众号管理 */
var moduleID_PublicNewsRelease = "A17F01";	//公众号信息发布权 (点击信息发布时)
var moduleID_PublicNewsView = "A17F01";		//公众号信息查看权
var moduleID_PublicNewsAdd = "A17F01Add";	//公众号信息新增权
var moduleID_PublicNewsDel = "A17F01Del";	//公众号信息删除权
var moduleID_PublicNewsPub = "A17F01Pub";	//公众号信息发布权 (进入信息列表页面)
var moduleID_PublicNewsUnDo = "A17F01UnDo";	//公众号信息撤销权
var moduleID_PublicNewsDeal = "A17F02";		//公众号信息处理权
var moduleID_PublicCenterCount = "A17F03";	//公众号企业中心统计查看权
var moduleID_PublicSetting = "A17F04";		//公众号设置权





//系统参数
var SystemPara_SystemMember = "SystemPara_SystemMember";      //成员查询范围
var SystemPara_MemberApply = "SystemPara_MemberApply";        //成员可提交申请
var SystemPara_ApplyApproval = "SystemPara_ApplyApproval";    //申请审核人选择范围
var SystemPara_ApplyMove = "SystemPara_ApplyMove";            //申请移交审核人选择范围
var SystemPara_ApplyUpReport = 'SystemPara_ApplyUpReport';	  //申请上报审核人选择范围

//工作密码使用模块ID
var SystemPwd_Wages = "SystemPwd_Wages";  //我的工资
var SystemPwd_Auth = "SystemPwd_Auth";  //我的职权
var SystemPwd_Export = "SystemPwd_Export"; //我导出的数据


//支付通道
var WorkServerPayCode = "12"; //企业购买服务业务码
var EnterprisePayCode = "11";//企业内部提现、充值业务码

//每页显示数据
function GetPageSize()
{
    return 10;
}


//以下为公用方法
var isDeBug = true;


//获取服务器地址
function GetEnterpriseUrl()
{
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/oa/";
    else
        return "http://ope.lingyi365.com:5608/oa/";
}
function GetHRUrl()
{
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/hr/";
    else
        return "http://ope.lingyi365.com:5608/hr/";
}
function GetBMSUrl() {
	if (GetIsProduction() == 1) {
		return "https://01.lingyi365.com/bms/"
	} else {
		return "http://172.18.104.247:7103/"
	}
}
function GetCommonUrl()
{
    return "https://01.lingyi365.com/commondata/";
}
//会议
function GetMeetingUrl() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/huiyi/api/";
    else
        return "http://ope.lingyi365.com:5608/huiyi/api/";
}

//医院
function GetHospitalUrl() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/hospitaloa/";
    else
        return "http://ope.lingyi365.com:5608/hospitaloa/";
}

//学校
function GetSchoolUrl() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/schooloa/";
    else
        return "http://ope.lingyi365.com:5608/schooloa/";
}

//宗教
function GetReligionUrl() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/Religion/";
    else
        return "http://ope.lingyi365.com:5608/Religion/";
}

//团队页面地址
function GetGroupUrl() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/tuanduipcweb/";
    else
        return "http://ope.lingyi365.com:5608/tuanduipcweb/";
}
//团队api
function GetGroupApi() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/tuandui/api/";
    else
        return "http://ope.lingyi365.com:5608/tuandui/api/";
}



//项目
function GetProjectUrl() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/gongcheng/";
    else
        return "http://ope.lingyi365.com:5608/gongcheng/";
}
//工程web
function GetProjectWeb() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/webui/web06/ProjectManagementOut/";
    else
        return "http://ope.lingyi365.com:5608/webui/web06/ProjectManagementOut/";
}



//政府
function GetGovUrl() {
    if (GetIsProduction() == 1)
        return "https://01.lingyi365.com/GovOA/";
    else
        return "http://ope.lingyi365.com:5608/GovOA/";
}



//调支付页面
function GetPayUrl(businessTypeCode, orderId, title, tradeMoney, backUrl) {
    //参数说明：
    //businessTypeCode：系统业务编码
    //orderId：系统业务订单号
    //title：支付标题
    //tradeMoney：支付金额，小数点保留后两位，单位元
    //backUrl：支付完成后跳转回的页面路径，注意：后边的参数必须通过encodeURIComponent方法进行编码

    var url = "http://ope.lingyi365.com:5608/payweb/Pages/ConfirmPay.html?";
    if (GetIsProduction() == 1)
        url = "https://01.lingyi365.com/payweb/Pages/ConfirmPay.html?";


    if (businessTypeCode == null) businessTypeCode = "";
    if (orderId == null) orderId = "";
    if (title == null) title = "";
    if (tradeMoney == null) tradeMoney = 0;
    if (backUrl == null) backUrl = "";

    showload('正在调用支付组件');
    url = url + "businessTypeCode=" + businessTypeCode + "&orderId=" + orderId + "&title=" + title + "&tradeMoney=" + tradeMoney + "&backUrl=" + encodeURIComponent(backUrl);
    location.href = url;
}




//获取用户的token
function GetUserToken() {
    if (isDeBug ==true)
        return "HtUJI95IHsrOk7FI6hGL6mrQObZDEQb6M87ky1SsWGyrZ9LYamYAag..";
    else
    {
        return browser().GetUserToken();
    }  
}
function GetUserID() {
    if (isDeBug == true)
        return "58c277fb59242e3d60bee2d1";
    else
    {
        return browser().GetUserID();
    }
}

function GetUserName() {
    if (isDeBug == true)
        return "高建平";
    else
    {
        return browser().GetUserName();
    }
}


//获取组织编号
function GetEnterpriseID()
{
    if (isDeBug == true)
        return "c8e0ca6b-b024-4ad1-8c9f-a798012d9724";  //c8e0ca6b-b024-4ad1-8c9f-a798012d9724  e7e56b10-7c2a-474c-a6db-a64100aaa924
    else
    {
        return browser().GetEnterpriseID();  
    }
}


//组织名称
function GetEnterpriseName()
{
    if (isDeBug == true)
        return "高建平那个测试";
    else {
        return browser().GetEnterpriseName();     
    }
}

function GetDepartmentID()
{
    if (isDeBug == true)
        return "707f160e-cb64-41ba-8890-a760012f2f88";
    else {
        return browser().GetDepartmentID();      
    }
}

function GetDepartmentName()
{
    if (isDeBug == true)
        return "开发3部";
    else {
        return browser().GetDepartmentName();       
    }
}

function GetUserMobile() {
    if (isDeBug == true)
        return "12345678901";
    else {
        return browser().UserMobile();      
    }
}


function GetIsEnterpriseAdmin()
{
    if (isDeBug == true)
        return "1";
    else {
        return browser().GetIsEnterpriseAdmin();       
    }
}


//是否部门管理员
function GetIsDepartmentAdmin()
{
    if (isDeBug == true)
        return "1";
    else {
        browser().GetIsDepartmentAdmin();       
    }
}

//当前用户注册的真实姓名
function GetUserRegTrueName()
{
    if (isDeBug == true)
        return "调试人";
    else {
        return browser().GetUserRegTrueName();      
    }
}

//当前用户注册的手机号
function GetUserRegMobile()
{
    if (isDeBug == true)
        return "12345678912";
    else {
        return browser().GetUserRegMobile();       
    }
}

//当前用户注册的头像
function GetUserRegImage()
{
    if (isDeBug == true)
        return "";
    else {
        return browser().GetUserRegImage();      
    }
}

//获取用户在企业下的头像
function GetEnterpriseUserPhoto()
{
    if (isDeBug == true)
        return "";
    else {
        return browser().GetEnterpriseUserPhoto();
    }
}

//获取当前用户信息
function GetUser()
{
    return $.parseJSON(browser().GetUserInfo());
}

//对具体的业务模块是否有权限
//function GetModuleAuthority(moduleID)
//{
//    if (isDeBug == true)
//        return "1";
//    else {
//        return browser().GetModuleAuthority(moduleID);       
//    }
//}


//模块是否有权限
function GetUserAuth(moduleID) {
    if (isDeBug == true)
        return "1";
    else {
        return browser().GetUserAuth(moduleID);  //不为1时，返回代码
    }
}

//业务模块是否有权限
function GetUserBusinessAuth(moduleID, btype, bid) {
    if (isDeBug == true)
        return "1";
    else {
        return browser().GetUserBusinessAuth(moduleID, btype, bid);  //不为1时，返回错误代码
    }
}



//判断按钮是否可见
function BtnIsVisibleForBussiness(moduleID, btype, bid) {
    if (GetUserBusinessAuth(moduleID, btype, bid) == "1") {
        return true;
    }
    else if (GetUserBusinessAuth(moduleID, btype, bid) == "-2") {
        return true;
    }
    else {
        return false;
    }
}
//判断是否可操作
function BtnIsOperateForBussiness(moduleID, btype, bid) {
    if (GetUserBusinessAuth(moduleID, btype, bid) == "1") {
        return true;
    }
    else if (GetUserBusinessAuth(moduleID, btype, bid) == "-2") {
        return false;
    }
    else {
        return false;
    }
}


//判断按钮是否可见
function BtnIsVisible(moduleID) {
    if (GetUserAuth(moduleID) == "1") {
        return true;
    }
    else if (GetUserAuth(moduleID) == "-2") {
        return true;
    }
    else {
        return false;
    }
}

//判断是否可操作
function BtnIsOperate(moduleID) {
    if (GetUserAuth(moduleID) == "1") {
        return true;
    }
    else if (GetUserAuth(moduleID) == "-2") {
        return false;
    }
    else {
        return false;
    }
}





//根据错误代码获取错误提示
function ShowMsgByAuthCode(authCode)
{
    var msg = ""; //提示信息
    var isAdmin = false; //是否期是企业管理员
    if (isDeBug == true)
    {
        msg = "错误提示";
        isAdmin = true;
    }
    else {
        msg = browser().ShowMsgByAuthCode(authCode); //根据权限码获取提示信息
        if (browser().GetIsEnterpriseAdmin() == "1") isAdmin = true;  //获取当前用户是不是企业管理员
        else isAdmin = false;
    }

    if (isAdmin && (authCode == "-1" || authCode == "-2")) //如果是管理员，提示去购买
    {
         var myDialog =  artDialog({
            id: 'Confirm',
            icon: 'question',
            fixed: true,
            lock: true,
            title: '系统提示',
            opacity: .2,
            content: msg,
            okVal: '去购买',
            ok: function () {
                OpenTabWindow("workBuy","购买新功能",GetEnterpriseUrl() + "WebPage/Views/EnterpriseBuyNewModules.html?from=1")
            },
            cancel: function (here) {
                myDialog.close();
            }
         });
    }
    else
    {
        artDialog.alert(msg);
    }
}


//获取业务ID
function GetUserBussinessID(moduleID, btype)
{
    if (isDeBug == true)
        return "@id1,id2";
    else {
        return browser().GetUserBussinessID(moduleID, btype);  //返回格式@id1,id2,id3,不是以@开头的都是错误提示
    }
}


//获取系统参数
function GetSystemPara(paraID)
{
    if (isDeBug == true)
        return "1";
    else {
        return browser().GetSystemPara(paraID);  //返回系统参数的值
    }
}

//获取是否使用工作密码 1-使用  0不使用
function GetUseWorkPwd(specialModuleID)
{
    if (isDeBug == true)
        return "1"; 
    else {
        return browser().GetUseWorkPwd(specialModuleID);  //返回是否使用工作密码
    }
}


function GetIsProduction()
{
    if (isDeBug == true)  //测试时，走内网
        return 0;
    else {

        var isProduction = browser().GetIsProduction();
        if (isProduction == "1") return 1;
        return 0;
    }
}


//当前用户的权限改变时，刷新所有页面
function SetResetUserAuth()
{
    if (isDeBug == false) 
    {
        showThroughLoad('正在刷新您的权限');

        browser().AuthChange();

        //延时关闭
        setTimeout(function () {
            closeload();
        }, 3000);
    }
}


//在新的tab窗口中打开一个连接
function OpenTabWindow(id,name,url)
{
    browser().OpenTabWindow(id, name, url);
}

//关闭一个已经打开的窗口
function CloseTabWindow(id)
{
    browser().CloseTabWindow(id);  
}


//刷新页面上的角标
function BackGetReportData()
{
    browser().BackGetReportData(); 
}


//刷新企业
function EnterpriseRefresh()
{
    browser().EnterpriseRefresh();
}

//打开新的企业
function ReSetEnterprise(enterpriseID)
{
    browser().ReSetEnterprise(enterpriseID); 
}


//打开一个新的工作区
function OpenOrgan(organType,organID)
{
    browser().OpenOrgan(organType,organID);
}



//打开新的企业,不显示订单
function SetEnterpriseSpace(enterpriseID) {
    browser().SetEnterpriseSpace(enterpriseID);
}


//退出企业
function EnterpriseOut()
{
    browser().LeaveWorkSpace();
}

//切换部门
function ReSetDepartment(departID) {
    if (isDeBug == false) {
        showThroughLoad('正在切换部门');
        browser().ReSetDepartment(departID);        
        //延时关闭
        setTimeout(function () {
            closeload();
        }, 3000);
    }
}


//发起聊天 uID-UserID,uName-UserName
function OpenChatWindow(uID,uName)
{
    browser().OpenChatWindow(uID, uName,"1001");
}


//预览pdf文件
function OpenPDFView(uName,uFile)
{
    browser().OpenPDFView(uName, uFile);
}


function GetServerData(type,url,data,successFn)
{
    showload('正在加载数据');
    $.ajax({
        type: type,
        url: url,
        data: data,
        cache: false,
        headers: {
            'Authentication': GetUserToken()
        },
        success: function (d) {
            closeload();
            successFn(d);
        },
        error: function (a, b, c) {
            closeload();
            //alert("请求服务器出现错误");
        }
    });
}
function GetThroughData(type, url, data, successFn) {
    showThroughLoad('正在加载数据');
    $.ajax({
        type: type,
        url: url,
        data: data,
        cache: false,
        headers: {
            'Authentication': GetUserToken()
        },
        success: function (d) {
            closeload();
            successFn(d);
        },
        error: function (a, b, c) {
            closeload();
            //alert("请求服务器出现错误");
        }
    });
}


//浏览器类型判断
function browser() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return window.external;
    else
        return bound;
}

//图书管理调用接口方法
function GetBMSServerData(type, url, data, successFn) {
	showload('正在加载数据');
    $.ajax({
        type: type,
        url: url,
        data: data,
		cache: false,
		contentType: 'application/json',
        headers: {
			'Accept': 'application/json',
            'Authentication': GetUserToken()
        },
        success: function (d) {
        	closeload();
            if (d.status !== 200 && d.status !== 1) {
                artDialog.alert('系统提示：' + d.message);
                return;
            }
            successFn(d);
        },
        error: function (a, b, c) {
        	closeload();
        	artDialog.alert('系统提示：请求服务器出现错误');
        }
    });
}

