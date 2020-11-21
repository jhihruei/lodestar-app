var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Modal } from 'antd';
import styled from 'styled-components';
export var StyledModal = styled(Modal)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    margin: 0;\n    padding: 0;\n\n    .ant-modal-content {\n      min-height: 100vh;\n    }\n  }\n"], ["\n  && {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    margin: 0;\n    padding: 0;\n\n    .ant-modal-content {\n      min-height: 100vh;\n    }\n  }\n"])));
export var StyledTitle = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
export var StyledSubTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
export var StyledWrapper = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin: 0 auto;\n  max-width: 40rem;\n"], ["\n  margin: 0 auto;\n  max-width: 40rem;\n"])));
export var StyledWarningText = styled.p(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-top: 1.25rem;\n  color: var(--gray-dark);\n  font-size: 12px;\n"], ["\n  margin-top: 1.25rem;\n  color: var(--gray-dark);\n  font-size: 12px;\n"])));
export var StyledCheckoutBlock = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1.71;\n  letter-spacing: 0.4px;\n\n  > div {\n    margin-bottom: 0.75rem;\n\n    > span:first-child {\n      overflow: hidden;\n      white-space: nowrap;\n      text-overflow: ellipsis;\n    }\n  }\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1.71;\n  letter-spacing: 0.4px;\n\n  > div {\n    margin-bottom: 0.75rem;\n\n    > span:first-child {\n      overflow: hidden;\n      white-space: nowrap;\n      text-overflow: ellipsis;\n    }\n  }\n"])));
export var StyledCheckoutPrice = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n  text-align: right;\n"], ["\n  color: ", ";\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n  text-align: right;\n"])), function (props) { return props.theme['@primary-color']; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=CheckoutProductModal.styled.js.map