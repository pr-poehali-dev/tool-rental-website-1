
// Базовые настройки для API
const API_URL = 'https://api.instrumentpro.ru/api/v1';

// Интерфейсы для различных сущностей
export interface Tool {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  image: string;
  category: string;
  available: boolean;
}

export interface Order {
  id: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  items: {
    toolId: number;
    name: string;
    quantity: number;
    pricePerDay: number;
  }[];
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "refunded";
}

export interface Booking {
  id: number;
  toolId: number;
  customerId: number;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "cancelled";
  totalPrice: number;
}

// Функция для обработки ошибок запросов
const handleApiError = (error: unknown) => {
  if (error instanceof Response) {
    return error.json().then(err => {
      throw new Error(err.message || 'Произошла ошибка при запросе к API');
    });
  }
  throw new Error('Произошла ошибка при подключении к серверу');
};

// Базовая функция для работы с API
const fetchApi = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json() as T;
  } catch (error) {
    return handleApiError(error);
  }
};

// API сервисы для различных сущностей
export const toolsApi = {
  getAll: async (): Promise<Tool[]> => {
    return fetchApi<Tool[]>('/tools');
  },
  
  getById: async (id: number): Promise<Tool> => {
    return fetchApi<Tool>(`/tools/${id}`);
  },
  
  create: async (tool: Omit<Tool, 'id'>): Promise<Tool> => {
    return fetchApi<Tool>('/tools', {
      method: 'POST',
      body: JSON.stringify(tool),
    });
  },
  
  update: async (id: number, tool: Partial<Tool>): Promise<Tool> => {
    return fetchApi<Tool>(`/tools/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(tool),
    });
  },
  
  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(`/tools/${id}`, {
      method: 'DELETE',
    });
  },
  
  toggleAvailability: async (id: number, available: boolean): Promise<Tool> => {
    return fetchApi<Tool>(`/tools/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ available }),
    });
  }
};

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    return fetchApi<Order[]>('/orders');
  },
  
  getById: async (id: string): Promise<Order> => {
    return fetchApi<Order>(`/orders/${id}`);
  },
  
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    return fetchApi<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  
  updatePaymentStatus: async (id: string, paymentStatus: Order['paymentStatus']): Promise<Order> => {
    return fetchApi<Order>(`/orders/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    });
  }
};

export const bookingsApi = {
  create: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    return fetchApi<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },
  
  getByToolId: async (toolId: number): Promise<Booking[]> => {
    return fetchApi<Booking[]>(`/bookings/tool/${toolId}`);
  },
  
  getByCustomerId: async (customerId: number): Promise<Booking[]> => {
    return fetchApi<Booking[]>(`/bookings/customer/${customerId}`);
  },
  
  confirmBooking: async (id: number): Promise<Booking> => {
    return fetchApi<Booking>(`/bookings/${id}/confirm`, {
      method: 'PATCH',
    });
  },
  
  cancelBooking: async (id: number): Promise<Booking> => {
    return fetchApi<Booking>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  },
  
  checkAvailability: async (toolId: number, startDate: string, endDate: string): Promise<{ available: boolean }> => {
    return fetchApi<{ available: boolean }>(`/bookings/check-availability`, {
      method: 'POST',
      body: JSON.stringify({ toolId, startDate, endDate }),
    });
  }
};

// Аутентификация
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    const response = await fetchApi<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },
  
  getCurrentUser: async (): Promise<any> => {
    return fetchApi<any>('/auth/me');
  }
};
