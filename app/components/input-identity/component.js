import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Component.extend({
  access: Ember.inject.service(),

  allowTeams: true,
  checking: false,
  addInput: '',
  allIdentities: null,

  init: function() {
    this.set('allIdentities', this.get('store').all('identity'));
    this.get('store').findAll('identity');
    this._super();
  },

  actions: {
    add: function() {
      if ( this.get('checking') )
      {
        return;
      }

      this.set('checking', true);
      var input = this.get('addInput').trim();

      this.get('store').find('identity', null, {filter: {name: input}}).then((info) => {
        this.set('addInput','');
        this.send('addObject', info.objectAt(0));
      }).catch(() => {
        this.sendAction('onError','Identity not found: ' + input);
      }).finally(() => {
        this.set('checking', false);
      });
    },

    addObject: function(info) {
      this.sendAction('action', info);
    }
  },

  addDisabled: function() {
    return this.get('checking') || this.get('addInput').trim().length === 0;
  }.property('addInput','checking'),

  placeholder: function() {
    if ( this.get('access.provider').toLowerCase() === 'githubconfig' )
    {
      return "Add a GitHub user or organization name";
    }
    else
    {
      return "Add a user or group by name";
    }
  }.property('access.provider'),

  dropdownChoices: function() {
    return this.get('allIdentities').filter((identity) => {
      return identity.get('externalIdType') != C.PROJECT.TYPE_LDAP_USER;
    });
  }.property('allIdentities.@each.externalIdType'),

  dropdownLabel: function() {
    if ( this.get('access.provider').toLowerCase() === 'githubconfig' )
    {
      return "Your Teams and Organizations";
    }
    else
    {
      return "Your Groups";
    }
  }.property('access.provider'),
});
