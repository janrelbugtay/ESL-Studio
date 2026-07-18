with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

content = content.replace(
'''          </button>
        </div>
      </div>
    </div>
  );
}''',
'''          </button>
        </div>
      </div>
      </div>
    </div>
  );
}''')

with open('src/views/BubblePop.tsx', 'w') as f:
    f.write(content)
