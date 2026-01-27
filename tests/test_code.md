# Code Highlighting Test

## JavaScript

```javascript
function fibonacci(n) {
  // Calculate fibonacci number
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(`Result: ${result}`);
```

## TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  findById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}
```

## Python

```python
def quicksort(arr):
    """Sort array using quicksort algorithm"""
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(numbers))
```

## Bash

```bash
#!/bin/bash

# Install dependencies and run tests
install_and_test() {
  local project_dir="$1"
  
  cd "$project_dir" || exit 1
  npm install
  npm test
  
  if [ $? -eq 0 ]; then
    echo "Tests passed!"
  else
    echo "Tests failed!"
    exit 1
  fi
}

install_and_test "/path/to/project"
```

## Plain Code (no language)

```
This is plain code without syntax highlighting.
It should still be formatted in a code block.
With proper borders and styling.
```
