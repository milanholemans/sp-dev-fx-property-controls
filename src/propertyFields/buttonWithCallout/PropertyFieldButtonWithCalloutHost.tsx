import * as React from 'react';
import { Button, IButtonProps } from 'office-ui-fabric-react';
import * as _ from 'lodash';

import PlaceholderWithCallout from '../../common/placeholderWithCallout/PlaceholderWithCallout';

import { IPropertyFieldButtonWithCalloutHostProps } from './IPropertyFieldButtonWithCalloutHost';


/**
 * Renders the control for PropertyFieldButtonWithCallout component
 */
export default class PropertyFieldButtonHost extends React.Component<IPropertyFieldButtonWithCalloutHostProps, null> {
    public render(): JSX.Element {
        return (
            <div>
                <PlaceholderWithCallout {...this.props}>
                    <Button {...this.props} />
                </PlaceholderWithCallout>
            </div>
        );
    }
}
