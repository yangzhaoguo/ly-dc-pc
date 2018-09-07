import Vue from 'vue';
import Router from 'vue-router';
import home from 'components/home/home';
import protocol from 'components/register/protocol';
import protocolSteps1 from 'components/register/protocolSteps1';
import protocolSteps2 from 'components/register/protocolSteps2';
import employWRC from 'components/employ/driverlessCars/employ_wrc';
import employDC from 'components/employ/bicycleSharing/employ_dc';
import indentListDc from 'components/indentList/indentList-dc';
import wrIndentListDc from 'components/indentList/wrindentList-dc';
import repair from 'components/repair/repair';
import uploadFile from 'common/uploadFile/uploadFile';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/home/employDC'
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/home/register/protocol',
          name: 'protocol',
          component: protocol
        },
        {
          path: '/home/register/protocolSteps1',
          name: 'protocolSteps1',
          component: protocolSteps1
        },
        {
          path: '/home/register/protocolSteps2',
          name: 'protocolSteps2',
          component: protocolSteps2
        },
        {
          path: '/home/employWRC',
          name: 'employ-wrc',
          component: employWRC
        },
        {
          path: '/home/employDC',
          name: 'employ-dc',
          component: employDC
        },
        {
          path: '/home/indentListDc',
          name: 'indentListDc',
          component: indentListDc
        },
        {
          path: '/home/wrindentListDc',
          name: 'wrIndentListDc',
          component: wrIndentListDc
        },
        {
          path: '/home/repair',
          name: 'repair',
          component: repair
        }
      ]
    },
    {
      path: '/upload',
      component: uploadFile
    }
  ]
});
