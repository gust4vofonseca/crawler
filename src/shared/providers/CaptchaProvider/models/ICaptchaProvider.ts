export interface ICaptcha {
  url: string;
  googlekey: string;
}

export interface ITextCaptcha {
  base64: string;
}

export interface ICaptchaProvider {
  captcha_text(base64: string): Promise<string>;
  captcha_v2(data: ICaptcha): Promise<string>;
  captcha_v3(data: ICaptcha): Promise<string>;
  hcaptcha(data: ICaptcha): Promise<string>;
}
