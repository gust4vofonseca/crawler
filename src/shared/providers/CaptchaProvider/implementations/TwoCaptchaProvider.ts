import axios from 'axios';
import AppError from '@shared/errors/AppError';
import { sleep } from '@shared/utils/sleep';
import { ICaptchaProvider, ICaptcha } from '../models/ICaptchaProvider';

export class TwoCaptchaProvider implements ICaptchaProvider {
  async captcha_text(base64: string): Promise<string> {
    try {
      const response = await axios.post(
        `http://2captcha.com/in.php?key=${process.env.TWO_CAPTCHA_KEY}&method=base64`,
        {
          body: base64,
        },
      );

      const [, id] = response.data.split('OK|');

      let breakCaptcha = await axios.get(
        `http://2captcha.com/res.php?key=${process.env.TWO_CAPTCHA_KEY}&action=get&id=${id}`,
      );

      while (breakCaptcha.data === 'CAPCHA_NOT_READY') {
        await sleep(2000);

        breakCaptcha = await axios.get(
          `http://2captcha.com/res.php?key=${process.env.TWO_CAPTCHA_KEY}&action=get&id=${id}`,
        );
      }

      const [, captchaValue] = breakCaptcha.data.split('OK|');

      return captchaValue;
    } catch (error) {
      throw new AppError('An error ocurred with text captcha.');
    }
  }

  async captcha_v2({ googlekey, url }: ICaptcha): Promise<string> {
    try {
      const response = await axios.get<string>(
        `https://2captcha.com/in.php?key=${process.env.TWO_CAPTCHA_KEY}&method=userrecaptcha&googlekey=${googlekey}&pageurl=${url}`,
      );

      const id = response.data.substr(3);

      let breakcaptcha = await axios.get(
        `https://2captcha.com/res.php?key=${process.env.TWO_CAPTCHA_KEY}&action=get&id=${id}`,
      );

      while (breakcaptcha.data === 'CAPCHA_NOT_READY') {
        await sleep(2000);

        breakcaptcha = await axios.get(
          `https://2captcha.com/res.php?key=${process.env.TWO_CAPTCHA_KEY}&action=get&id=${id}`,
        );
      }

      const captcha = breakcaptcha.data.substr(3);

      return captcha;
    } catch (error) {
      throw new AppError('An error ocurred with captcha v2.');
    }
  }

  async captcha_v3({ googlekey, url }: ICaptcha): Promise<string> {
    try {
      const response = await axios.get<string>(
        `http://2captcha.com/in.php?key=${process.env.TWO_CAPTCHA_KEY}&method=userrecaptcha&version=v3&min_score=0.3&googlekey=${googlekey}&pageurl=${url}`,
      );

      const id = response.data.substr(3);

      let breakcaptcha = await axios.get(
        `http://2captcha.com/res.php?key=${process.env.TWO_CAPTCHA_KEY}&action=get&id=${id}`,
      );

      while (breakcaptcha.data === 'CAPCHA_NOT_READY') {
        await sleep(2000);

        breakcaptcha = await axios.get(
          `http://2captcha.com/res.php?key=${process.env.TWO_CAPTCHA_KEY}&action=get&id=${id}`,
        );
      }

      const captcha = breakcaptcha.data.substr(3);

      return captcha;
    } catch (error) {
      throw new AppError('An error ocurred with captcha v3.');
    }
  }

  async hcaptcha({ googlekey, url }: ICaptcha): Promise<string> {
    try {
      const response = await axios.get<string>(
        `https://2captcha.com/in.php?key=${process.env.TWO_CAPTCHA_KEY}&method=hcaptcha&sitekey=${googlekey}&pageurl=${url}`,
      );

      const id = response.data.substr(3);

      let breakcaptcha = await axios.get(
        `https://2captcha.com/res.php?key=${process.env.TWO_CAPTCHA_KEY}&action=get&id=${id}`,
      );

      while (breakcaptcha.data === 'CAPCHA_NOT_READY') {
        await sleep(2000);

        breakcaptcha = await axios.get(
          `https://2captcha.com/res.php?key=${process.env.TWO_CAPTCHA_KEY}&action=get&id=${id}`,
        );
      }

      const captcha = breakcaptcha.data.substr(3);

      return captcha;
    } catch (error) {
      throw new AppError('An error ocurred with hcaptcha.');
    }
  }
}
