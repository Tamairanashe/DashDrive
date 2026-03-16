import { User, Lock, Bell, CreditCard, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
          <aside className="py-6 lg:col-span-3">
            <nav className="space-y-1">
              <a href="#" className="bg-indigo-50 border-indigo-500 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700 group border-l-4 px-3 py-2 flex items-center text-sm font-medium" aria-current="page">
                <User className="text-indigo-500 group-hover:text-indigo-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" aria-hidden="true" />
                <span className="truncate">Profile</span>
              </a>
              <a href="#" className="border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900 group border-l-4 px-3 py-2 flex items-center text-sm font-medium">
                <Globe className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" aria-hidden="true" />
                <span className="truncate">Organization</span>
              </a>
              <a href="#" className="border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900 group border-l-4 px-3 py-2 flex items-center text-sm font-medium">
                <Lock className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" aria-hidden="true" />
                <span className="truncate">Security</span>
              </a>
              <a href="#" className="border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900 group border-l-4 px-3 py-2 flex items-center text-sm font-medium">
                <Bell className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" aria-hidden="true" />
                <span className="truncate">Notifications</span>
              </a>
              <a href="#" className="border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900 group border-l-4 px-3 py-2 flex items-center text-sm font-medium">
                <CreditCard className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" aria-hidden="true" />
                <span className="truncate">Billing & Payouts</span>
              </a>
            </nav>
          </aside>

          <div className="divide-y divide-gray-200 lg:col-span-9">
            <form className="py-6 px-4 sm:p-6 lg:pb-8" action="#" method="POST">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">Profile</h2>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>

              <div className="mt-6 flex flex-col lg:flex-row">
                <div className="flex-grow space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="mt-1 rounded-md shadow-sm flex">
                      <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                        eventpartner.com/
                      </span>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 border py-2 px-3"
                        defaultValue="tomcook"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                        defaultValue="Event organizer specializing in tech conferences and music festivals."
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
                  <p className="text-sm font-medium text-gray-700" aria-hidden="true">
                    Photo
                  </p>
                  <div className="mt-1 lg:hidden">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12" aria-hidden="true">
                        <img className="rounded-full h-full w-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      </div>
                      <div className="ml-5 rounded-md shadow-sm">
                        <div className="group relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <label htmlFor="mobile-user-photo" className="relative text-sm leading-4 font-medium text-gray-700 pointer-events-none">
                            <span>Change</span>
                            <span className="sr-only"> user photo</span>
                          </label>
                          <input id="mobile-user-photo" name="user-photo" type="file" className="absolute w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden relative rounded-full overflow-hidden lg:block">
                    <img className="relative rounded-full w-40 h-40" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    <label htmlFor="desktop-user-photo" className="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100">
                      <span>Change</span>
                      <span className="sr-only"> user photo</span>
                      <input type="file" id="desktop-user-photo" name="user-photo" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" defaultValue="Tom" />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" defaultValue="Cook" />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input id="email" name="email" type="email" autoComplete="email" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" defaultValue="tom@example.com" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button type="button" className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button type="submit" className="ml-5 bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
