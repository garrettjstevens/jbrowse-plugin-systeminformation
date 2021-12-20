import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import { AbstractSessionModel, isAbstractMenuManager } from '@jbrowse/core/util'
import ComputerIcon from '@material-ui/icons/Computer'
import { version } from '../package.json'
import {
  ReactComponent as SystemInformationViewReactComponent,
  stateModel as systemInformationViewStateModel,
} from './SystemInformationView'

export default class SysteminformationPlugin extends Plugin {
  name = 'SysteminformationPlugin'
  version = version

  install(pluginManager: PluginManager) {
    pluginManager.addViewType(() => {
      return new ViewType({
        name: 'SystemInformationView',
        stateModel: systemInformationViewStateModel,
        ReactComponent: SystemInformationViewReactComponent,
      })
    })
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToMenu('Add', {
        label: 'System Information View',
        icon: ComputerIcon,
        onClick: (session: AbstractSessionModel) => {
          session.addView('SystemInformationView', {})
        },
      })
    }
  }
}
