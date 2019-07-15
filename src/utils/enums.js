// 返回代码枚举
const resultCode = {
  NG_PRINCIPAL: '用户名或密码错误',  // 用户名不存在
  NG_CREDENTIAL: '用户名或密码错误', // 密码错误
  NG_ACCOUNT: '用户名或密码错误',  // 用户名或密码错误
  NG_USER_NOT_FOUND: '用户未找到',
  NG_UNSUPPORTED: '不支持的认证请求',
  OK: '操作成功',
  NG: '操作失败',
  NG_CAPTCHA: '验证码输入错误',
  NG_DATA_NOT_FOUND: '数据未找到',
  NG_DATA_ALREADY_EXISTS: '数据已存在',
  NG_UK_CONSTRAINT: '违反唯一约束',
  NG_NOT_NULL_CONSTRAINT: '非空约束',
  NG_ASSIGNED_ASSIGNEE_ERROR: '流程处理人设置错误',
  NG_PROC_DEF_KEY_NOT_FOUND: '未找到流程定义',
  NG_EMAIL_FORMAT_ERROR: '邮箱格式不正确',
  NG_MOBILE_FORMAT_ERROR: '手机格式不正确',
  NG_USER_ALREADY_EXISTS: '用户已存在',
  NG_NEW_PWD_IS_OLD: '新密码与旧密码重复',
  NG_NEW_PWD_IS_POOR: '新密码强度不够',
  NG_OLD_PWD_IS_WRONG: '旧密码错误',
  NG_ROLE_ALREADY_EXISTS: '角色已存在',
  NG_ROLE_DEPENDENT_EXISTS: '角色使用中,不允许删除',
  NG_FAULT_FORM_ALREADY_EXISTS: '故障单已存在',
  NG_EMPLOYEE_ALREADY_EXISTS: '员工已存在',
  NG_OPERATION_UNIT_ALREADY_EXISTS: '公司已存在',
  NG_ORGANIZATION_ALREADY_EXISTS: '部门已存在',
  NG_FAULT_MODEL_ALREADY_EXISTS: '故障信息已存在',
  NG_PRODUCT_ALREADY_EXISTS: '产品已存在',
  NG_AUTH_ROLE_EXISTS: '角色已被定义',
  NG_AUTH_ROLE_IN_SERVICE: '角色正在使用中',
  NG_PWD_IS_POOR: '密码太弱',
  NG_OLD_PWD_BAD: '旧密码不正确',
  NG_USER_EXISTS: '用户已添加',
  NG_BPM_ROLE_SETTLE_ERROR: '流程角色设置错误',
  NG_BPM_ROLE_EXISTS: '角色已被定义',
  NG_BPM_ROLE_IN_SERVICE: '角色正在使用中',
  NG_REMINDER_EXISTS: '预警提醒已被定义',
  NG_REMINDER_IN_SERVICE: '预警提醒正在使用中',
  NG_SUPP_EMAIL_EXISTS: '用户邮箱已存在',
  NG_SUPP_QUALIFY_REQUIRED: '至少上传一个供应商资质',
  NG_DELETE_HAS_USED: '模板已被使用，不能作废',
  NG_UPDATE_HAS_USED: '模板已被使用，不能修改',
  NG_DUPLICATED_ITEM: '重复物料,请填写新物料',
  NG_ITEM_IS_REPLACED: '本物料已有替代物料，不能再替代其它物料',
  NG_BPM_ASSIGNEE_NOT_FOUND: '流程责任处理人未设置正确',
  NG_NO_MODEL_IN_EDITING: '未找到编辑中的流程模型',
  NG_FILE_SAVE_ERROR: '导入文档保存错误',
  NG_FILE_SAVE_SERVER_ERROR: '导入文档保存服务端错误',
  NG_MAX_TIMES: '已达最大投标次数',
  NG_FINAL_TIME: '已过投标截止日期',
  NG_NOT_BID: '该招标单已开标，不可再评标',
  NG_NOT_BID2: '该招标单已过开标时间，不可再评标',
  NG_NOT_USER: '您不是该招标单的评标人',
  NG_CHECK_DATE: '合同生效日期在其他合同有效期内',
  NG_SCAN_ERROR: '行驶证识别失败,请重新上传！',
  NG_EXIST_MOBILE: '手机号已存在,请勿重复添加!',
  NG_UNIQUE_CODE: '编码已存在,请重新输入!',
  NG_EMPTY_ACTIVE_RULE: '未匹配到活动奖励规则',
  NG_MORE_ACTIVE_RULE: '匹配到多条活动奖励规则!',
  NG_ENOUGH_JD_CARD: '京东购物卡不足!',
  NG_PAYLOAD_CODE: '编码已存在！请勿重复添加！',
  NG_REPEAT_PLAT_NO: '车牌号已被注册！请确认后重新上传！',
  NG_IN_ACTIVE_TIME: '活动已过期!',
  NG_JOIN_ITEM: '未找到活动规定的参与商品！',
  NG_ORG_LIMIT_RULE: '未找到对应经销商配额限制！',
  NG_ORG_PRE_RULE: '未找到经销商对应奖品的配额限制!',
  NG_ORG_PRE_MORE_RULE: '找到多于一条经销商对应奖品的配额限制！',
  NG_ORG_LIMIT_NO_ENOUGH: '供应商额度不足！',
  NG_ACTIVE_ACCEPT_TIME: '领奖截止日期应在活动结束日期之后！',
  // 文件相关
  NG_IO: 'IO异常发生',
  NG_SIZE: '文件太大',
  NG_MIME: '文件类型不符合要求',
  NG_IMG_W: '图片宽度不符合要求',
  NG_IMG_H: '图片高度不符合要求',
  NG_IMG_R: '图片比率不符合要求',
  NG_TMP_DIR: '临时目录不存在了',
}

export default {
  resultCode,
}
