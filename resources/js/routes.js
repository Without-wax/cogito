/*
|-------------------------------------------------------------------------------
| routes.js
|-------------------------------------------------------------------------------
| Contains all of the routes for the application
*/

/*
    Imports Vue and VueRouter to extend with the routes.
*/
import Vue from 'vue';
import VueRouter from 'vue-router';
import { routerHistory } from 'vue-router-back-button';
import HeaderComponent from './components/global/Navigation.vue';
import FooterComponent from './components/global/Footer.vue';

import store from './store.js';

/*
    Extends Vue to use Vue Router
*/
Vue.use(VueRouter);
Vue.use(routerHistory);

/*
	This will cehck to see if the user is authenticated or not.
*/
function requireAuth(to, from, next) {
	/*
		Determines where we should send the user.
	*/
    function proceed() {
		/*
			If the user has been loaded determine where we should
			send the user.
		*/
        if (store.getters.getUserLoadStatus == 2) {
            next();
        } else if (store.getters.getUserLoadStatus == 3) {
            //user is not logged in
            console.log('you are not logged in');
        }
    }

    proceed();
}

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            components: {
                default: Vue.component('HomeComponent', require('./pages/Home.vue').default),
                header: Vue.component('HeaderComponent', HeaderComponent),
                footer: Vue.component('FooterComponent', FooterComponent)
            }
        },
        {
            path: '/contact',
            name: 'Contact',
            components: {
                default: Vue.component('ContactComponent', require('./pages/Contact.vue').default),
                header: Vue.component('HeaderComponent', HeaderComponent),
                footer: Vue.component('FooterComponent', FooterComponent)
            }
        },
        {
            path: '/admin',
            components: {
                default: Vue.component('AdminComponent', require('./pages/Admin.vue').default),
                header: Vue.component('HeaderComponent', HeaderComponent),
                footer: Vue.component('FooterComponent', FooterComponent)
            },
            children: [
                {
                    path: '',
                    redirect: '/admin/users',
                    name: 'Admin Dashboard',
                    components: {
                        default: Vue.component('UsersComponent', require('./pages/Dashboard.vue').default),
                        header: Vue.component('HeaderComponent', HeaderComponent),
                        footer: Vue.component('FooterComponent', FooterComponent)
                    }
                },
                {
                    path: 'users',
                    components: {
                        default: Vue.component('UsersComponent', require('./pages/Users.vue').default),
                        header: Vue.component('HeaderComponent', HeaderComponent),
                        footer: Vue.component('FooterComponent', FooterComponent)
                    },
                    children: [
                        {
                            path: '',
                            name: 'Users',
                            component: Vue.component(
                                'BrowseUsers',
                                require('./components/users/BrowseUsers.vue').default
                            ),
                            beforeEnter: requireAuth,
                            meta: {
                                permitted: ['Super-admin'],
                                permittedToMakeChanges: ['Super-admin']
                            }
                        },
                        {
                            path: 'edit/:userId',
                            name: 'Edit User',
                            component: Vue.component(
                                'EditUser',
                                require('./components/users/EditUser.vue').default
                            ),
                            beforeEnter: requireAuth,
                            meta: {
                                permitted: ['Super-admin']
                            }
                        },
                        {
                            path: 'add',
                            name: 'Add User',
                            component: Vue.component(
                                'AddUser',
                                require('./components/users/AddUser.vue').default
                            ),
                            beforeEnter: requireAuth,
                            meta: {
                                permitted: ['Super-admin']
                            }
                        }
                    ]
                },
                {
                    path: 'config',
                    name: 'Config',
                    components: {
                        default: Vue.component('ConfigComponent', require('./pages/Config.vue').default),
                        header: Vue.component('HeaderComponent', HeaderComponent),
                        footer: Vue.component('FooterComponent', FooterComponent)
                    }
                }
            ]
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});

router.beforeEach((to, from, next) => {
    //store.dispatch('getAuthUser');
    next();
});

export default router;