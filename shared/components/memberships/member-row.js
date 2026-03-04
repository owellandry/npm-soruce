'use strict'
const PropTypes = require('prop-types')
const types = require('../../types')
const React = require('react')

const RadioGroup = require('../inputs/radio-group')
const GenericForm = require('../forms/generic')
const Avatar = require('@npm/design-system/avatar/avatar')
const TFAStatus = require('./tfa-status')
const connect = require('../connect')
const XIcon = require('../icons/x-icon')

const forms = require('../../styles/forms.css')
const {a11yOnly} = require('../../styles/global.css')
const styles = require('./member-row.css')

class MemberRow extends React.PureComponent {
  updateRole(ev, user) {
    const action = ev.target.form.action
    const role = ev.target.value
    const item = {role, user: {name: user}}
    this.props.dispatch({
      type: 'ORG_MEMBER_UPDATE',
      action,
      item,
      body: {
        role,
        user,
      },
    })
  }

  removeUser(ev, user) {
    ev.preventDefault()
    const action = ev.target.action
    const item = {user: {name: user}}
    this.props.dispatch({
      type: 'ORG_MEMBER_RM',
      action,
      item,
      body: {},
    })
  }

  render() {
    const {currUser, scopeName, formData, membership, canRemoveUser} = this.props

    const {user, role} = membership
    const {name, tfa, resource = {}} = user
    const {fullname} = resource
    const isCurrUser = name === currUser.name
    const formId = `$role-${name}`
    const deleteAction = this.props.deleteAction || `/settings/${scopeName}/members/${name}/delete`
    const canEditRole = typeof this.props.canEditRole === 'undefined' ? canRemoveUser : this.props.canEditRole

    const key = this.props.key || `row-${name}`

    return [
      <div key={`${key}-avatar`} className="flex-none">
        <Avatar
          size="small"
          role="img"
          title=""
          aria-label={`${name} (member)`}
          src={user.avatars ? user.avatars.medium : ''}
        />
      </div>,
      <h3 key={`${key}-h3`} className="flex-auto ma0-ns ml2-ns pa0">
        <div>{name}</div>
        {fullname && <div className="f6 lh-copy normal truncate mid-gray">{fullname}</div>}
      </h3>,
      <TFAStatus key={`${key}-tfa-status`} tfa={tfa} />,
      <div key={`${key}-role`} data-type="role" className={`${styles.textAlignCenter} flex-auto`}>
        {isCurrUser || !canEditRole ? (
          <div className="black-60 db fw5 w5 mr4 ph2 pv1 ttl">{roleMap[role]}</div>
        ) : (
          <GenericForm
            className="ma0-ns pr2-ns ph2"
            action={`/settings/${scopeName}/members/${name}`}
            formId={formId}
            formData={formData}
            showButton={false}
          >
            <RadioGroup
              formId={formId}
              formData={formData}
              dispatch={this.props.dispatch}
              onChange={ev => this.updateRole(ev, name)}
              name={'role'}
              initialValue={role}
              values={[
                {
                  value: 'developer',
                  label: 'Member',
                },
                {
                  value: 'team-admin',
                  label: 'Admin',
                },
                {
                  value: 'super-admin',
                  label: 'Owner',
                },
              ]}
            />
          </GenericForm>
        )}
      </div>,
      <div key={`${key}-delete`} className={`${styles.deleteContainer} ml5`}>
        {isCurrUser || !canRemoveUser ? null : (
          <GenericForm
            className="ma0-ns"
            method="POST"
            action={deleteAction}
            formData={formData}
            formId={`delete-${name}`}
            showButton={false}
            onSubmit={ev => this.removeUser(ev, name)}
          >
            <button type="submit" className={forms.deleteButtonLg}>
              <span className={a11yOnly}>{`Remove ${name} from team`}</span>
              <XIcon />
            </button>
          </GenericForm>
        )}
      </div>,
    ]
  }
}

const roleMap = {
  developer: 'Member',
  'team-admin': 'Admin',
  'super-admin': 'Owner',
}

const userType = PropTypes.shape({
  name: PropTypes.string.isRequired,
})

MemberRow.propTypes = {
  currUser: userType.isRequired,
  scopeName: PropTypes.string.isRequired,
  membership: PropTypes.shape({
    user: userType.isRequired,
    role: PropTypes.oneOf(Object.keys(roleMap)).isRequired,
    pending: PropTypes.bool,
  }).isRequired,
  formData: types.formData.isRequired,
  canRemoveUser: PropTypes.bool,
  canEditRole: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  deleteAction: PropTypes.string,
}

module.exports = connect()(MemberRow)
