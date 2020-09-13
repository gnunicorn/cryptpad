/*
 * You can override the configurable values from this file.
 * The recommended method is to make a copy of this file (/customize.dist/application_config.js)
   in a 'customize' directory (/customize/application_config.js).
 * If you want to check all the configurable values, you can open the internal configuration file
   but you should not change it directly (/common/application_config_internal.js)
*/
define(['/common/application_config_internal.js'], function (AppConfig) {
    // Example: If you want to remove the survey link in the menu:
    // AppConfig.surveyURL = "";


    AppConfig.availablePadTypes = ['drive', 'teams', 'pad', 'sheet', 'code', 'slide', 'poll', 'kanban', 'whiteboard',
                                'miniapp', /*'oodoc', 'ooslide',*/ 'file', 'todo', 'contacts', 'taskivista'];
    /* The registered only types are apps restricted to registered users.
     * You should never remove apps from this list unless you know what you're doing. The apps
     * listed here by default can't work without a user account.
     * You can however add apps to this list. The new apps won't be visible for unregistered
     * users and these users will be redirected to the login page if they still try to access
     * the app
     */
    AppConfig.registeredOnlyTypes = ['file', 'contacts', 'oodoc', 'ooslide', 'notifications', 'taskivista'];
    // To inform users of the support ticket panel which languages your admins speak:
    //AppConfig.supportLanguages = [ 'en', 'fr' ];

    return AppConfig;
});
