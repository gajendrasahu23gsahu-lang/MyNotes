
import React from 'react';

export const TAG_COLORS: Record<string, string> = {
  Work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Personal: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Ideas: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export const Icons = {
  Add: () => <span className="material-icons-round">add</span>,
  Search: () => <span className="material-icons-round">search</span>,
  Delete: () => <span className="material-icons-round text-red-500">delete_outline</span>,
  Edit: () => <span className="material-icons-round">edit</span>,
  Dark: () => <span className="material-icons-round">dark_mode</span>,
  Light: () => <span className="material-icons-round">light_mode</span>,
  Logout: () => <span className="material-icons-round">logout</span>,
  Tag: () => <span className="material-icons-round text-sm mr-1">label</span>,
  Grid: () => <span className="material-icons-round">grid_view</span>,
  List: () => <span className="material-icons-round">view_list</span>,
  Back: () => <span className="material-icons-round">arrow_back</span>,
};
