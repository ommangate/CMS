import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/menuService';
import { MenuItem } from '../../types/menu';
import { Search, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const StoreMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const items = await menuService.getMenuItems();
        setMenuItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast.error('Failed to load menu items');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);
  
  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(menuItems);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = menuItems.filter(item => 
        item.name.toLowerCase().includes(lowercaseSearch) ||
        item.category.toLowerCase().includes(lowercaseSearch) ||
        item.description.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, menuItems]);
  
  // Mock function to save item changes
  const handleSaveItem = async (item: MenuItem) => {
    // In a real app, this would call an API to update the item
    try {
      // Mock API delay
      toast.loading('Saving changes...', { id: 'saving' });
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the local state
      setMenuItems(prevItems => 
        prevItems.map(prevItem => 
          prevItem.id === item.id ? item : prevItem
        )
      );
      
      setEditingItem(null);
      toast.dismiss('saving');
      toast.success('Item updated successfully');
    } catch (error) {
      toast.dismiss('saving');
      toast.error('Failed to update item');
    }
  };
  
  // Mock function to toggle availability
  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, available: !currentStatus } : item
        )
      );
      
      toast.success(`Item ${currentStatus ? 'unavailable' : 'available'}`);
    } catch (error) {
      toast.error('Failed to update item availability');
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Menu Management</h1>
        
        <Button
          variant="primary"
          size="sm"
          className="self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Item
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            <Search className="h-5 w-5" />
          </div>
        </div>
      </div>
      
      {/* Menu Items Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    {editingItem?.id === item.id ? (
                      // Editing mode
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <Input
                              value={editingItem.name}
                              onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                              placeholder="Item name"
                            />
                            <textarea
                              value={editingItem.description}
                              onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                              className="input w-full"
                              rows={2}
                              placeholder="Description"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            value={editingItem.category}
                            onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                            placeholder="Category"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            value={editingItem.price}
                            onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                            placeholder="Price"
                            step="0.01"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={editingItem.available}
                              onChange={e => setEditingItem({ ...editingItem, available: e.target.checked })}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Available
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSaveItem(editingItem)}
                            className="mr-2"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(null)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">
                            {item.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={item.available ? 'success' : 'error'}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAvailability(item.id, item.available)}
                            className="mr-2"
                          >
                            {item.available ? 'Set Unavailable' : 'Set Available'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                            className="mr-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-error-500" />
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreMenu;