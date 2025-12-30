import {
  LayoutDashboard,
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  SortAsc,
  Calendar,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Gift,
  LogOut,
  LogIn,
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Settings,
  HelpCircle,
  AlertCircle,
  Info,
  Loader2,
  Check,
  AlertTriangle,
  Sparkles,
  Zap,
  Target,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  EyeOff,
  Copy,
  Share2,
  Save,
  RefreshCw,
} from 'lucide-react';

export const Icons = {
  // Navigation
  dashboard: LayoutDashboard,
  applications: FileText,
  search: Search,
  menu: Menu,
  close: X,
  
  // Actions
  add: Plus,
  edit: Edit,
  delete: Trash2,
  download: Download,
  upload: Upload,
  save: Save,
  copy: Copy,
  share: Share2,
  refresh: RefreshCw,
  
  // Filters & Sorting
  filter: Filter,
  sort: SortAsc,
  
  // Application Status
  applied: CheckCircle2,
  interview: Clock,
  offer: Gift,
  rejected: XCircle,
  
  // Info
  calendar: Calendar,
  company: Building2,
  briefcase: Briefcase,
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  linkedin: Linkedin,
  github: Github,
  externalLink: ExternalLink,
  
  // UI Elements
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  moreVertical: MoreVertical,
  
  // Settings & User
  settings: Settings,
  logout: LogOut,
  login: LogIn,
  sun: Sun,
  moon: Moon,
  
  // Status & Feedback
  help: HelpCircle,
  alert: AlertCircle,
  info: Info,
  loading: Loader2,
  check: Check,
  warning: AlertTriangle,
  
  // Features
  sparkles: Sparkles,
  zap: Zap,
  target: Target,
  
  // Charts & Stats
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  barChart: BarChart3,
  pieChart: PieChart,
  activity: Activity,
  users: Users,
  
  // Visibility
  eye: Eye,
  eyeOff: EyeOff,
} as const;

// Icon component wrapper with consistent styling
export interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

// Helper to get status icon and color
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Applied':
      return { Icon: Icons.applied, color: 'text-blue-500' };
    case 'Interview':
      return { Icon: Icons.interview, color: 'text-yellow-500' };
    case 'Offer':
      return { Icon: Icons.offer, color: 'text-green-500' };
    case 'Rejected':
      return { Icon: Icons.rejected, color: 'text-red-500' };
    default:
      return { Icon: Icons.briefcase, color: 'text-gray-500' };
  }
};

// Helper to get status gradient
export const getStatusGradient = (status: string) => {
  switch (status) {
    case 'Applied':
      return 'from-blue-600 to-cyan-600';
    case 'Interview':
      return 'from-yellow-600 to-orange-600';
    case 'Offer':
      return 'from-green-600 to-emerald-600';
    case 'Rejected':
      return 'from-red-600 to-pink-600';
    default:
      return 'from-gray-600 to-gray-700';
  }
};
