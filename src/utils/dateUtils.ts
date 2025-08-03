export class DateUtils {
  static formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  static getDateRange(fromDate: string, toDate: string): { from: string; to: string } {
    return {
      from: fromDate || '',
      to: toDate || ''
    };
  }
} 