import { Component, Vue } from 'vue-property-decorator';

import { request, handleException } from '@utils/request';

@Component
export default class GlobalMixin extends Vue {
  $request(key: string, data: any): Promise<any> {
    return request(key, data);
  }

  $handleException(e: Error, content?: string): void {
    return handleException(e, content);
  }
};
