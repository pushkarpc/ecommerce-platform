def calculate_hcf(n1, n2):
    while n2 != 0:
        n1,n2 = n2, n1%n2
    return n1

def calculate_lcm(n1,n2,hcf):
    return (n1*n2)/hcf


if __name__ == '__main__':
    try:
        num1 = int(input('Enter first number: '))
        num2 = int(input('Enter second number: '))
        hcf = calculate_hcf(num1, num2)
        lcm = calculate_lcm(num1, num2, hcf)
        print(f'LCM is: {lcm}')
        print(f'HCF is: {hcf}')
    except ValueError:
        print('Please enter valid integers.')